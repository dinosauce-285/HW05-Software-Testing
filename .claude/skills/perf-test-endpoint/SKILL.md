---
name: perf-test-endpoint
description: "Design, run and analyse a JMeter performance scenario (Load / Stress / Spike / Soak) for one endpoint group. Use when measuring a new API's performance, hunting for the break point, establishing an endurance threshold, or analysing a .jtl file. Covers the whole pipeline - probe the endpoint, generate data, build the test plan, smoke it, run it with resource monitoring, analyse the raw log, collect evidence."
---

# Performance-testing one endpoint group

A 7-step procedure distilled from 8 real runs against the EShop backend (HW05). Every warning in
this document maps to a mistake actually made and fixed - none of them are theoretical.

**Overriding principle:** no number may appear in a report unless it can be pulled out of the raw
`.jtl` with a command.

---

## Step 1 - Probe the endpoint with real requests

**Do not read the source and infer.** Call it, look at what comes back.

```bash
curl -s -w '\n<- HTTP %{http_code}  Content-Type: %{content_type}\n' <endpoint>
```

Four questions must be answered before the first line of `.jmx` is written:

| Question | Why it matters |
|---|---|
| Does the endpoint need a token? | If yes, the plan needs a setUp Thread Group - see step 4 |
| What is the exact body and field naming? | AI invents field names constantly. Only `curl` confirms them |
| Is there stateful behaviour? (account lockout, rate limit, session) | Decides whether a reset between runs is mandatory |
| What does an error return - JSON or HTML? | The assertion must check that exact thing |

! **The SUT's own documentation may be wrong.** Read the source to cross-check, but treat the
`curl` result as the source of truth.

---

## Step 2 - Generate baseline data

A SUT's seeded data is almost never enough for data-driven testing.

**Golden rule:** generate data with a structure known in advance, so that **assertion expectations
derive from that structure** - never from the SUT's own response. Deriving them backwards from the
response makes every assertion pass by construction and strips them of all value.

Example: generate a catalogue as `7 brands x 3 generations x 7 variants` -> the search term `iPhone`
must return exactly 21 results -> the `expect_min_count` column in the CSV now has a basis.

---

## Step 3 - Generate the CSV, one file per endpoint group

An `expect_*` column lets the assertion read its expectation **from the data** instead of
hard-coding it in the plan:

```csv
search_term,expect_min_count,expect_code,note
iPhone,21,200,matching keyword
O'Neill,0,200,single quote - expected to expose SQL injection
```

**Always include a few poison rows**: a single quote, an empty string, Unicode characters, an
out-of-range value. It was the `O'Neill` row above that exposed the SQL injection hole in the SUT.

---

## Step 4 - Build the `.jmx` test plan

Read `references/jmx-template.md` for the XML skeleton and the list of traps.

### Five invariants, checked every single time the plan is touched

| Invariant | Why |
|---|---|
| Each endpoint group gets its **own CSV** | Sharing one file across groups fails the data-driven requirement |
| The three plans use **three different listener types** | Summary Report / Aggregate Report / View Results Tree |
| Filename `{StudentID}_{Scenario}_{YYYYMMDD}` | The date the plan was **created**, not the submission date |
| Think-time and ramp-up **defensible in words** | "The AI suggested 100 threads" is not a reason |
| **>= 3 distinct assertion types**, not just a 200 check | A 500 still looks "fast" if you only measure time |

### Parameters per scenario type

| Scenario | Threads | Ramp-up | Think-time | Notes |
|---|---|---|---|---|
| **Load** | Everyday level | Long, even | 800 ms +/- 200 | Any higher and it becomes a stress test |
| **Stress** | High, linearly increasing | Constant rate; ramp-up seconds = thread count gives exactly 1 user/second | 300 ms +/- 100 | A constant ramp rate turns the time axis into a load axis, so the break point reads off as a number instead of a guess |
| **Spike** | Low baseline + a 10-30x burst | Burst ramp **<= 5 seconds** | 1000 ms +/- 300 | **Two separate Thread Groups** - merged into one, recovery cannot be measured |
| **Soak** | ~80% of the saturation level | Short | Same as Load | 10-15 minutes, and RSS must be sampled too |

### Three traps already walked into

**Trap 1 - Expected error responses counted as failures.** When a scenario has a negative branch
(401/403/404 is the *correct* outcome), JMeter still marks the sample failed, because it treats any
4xx as an error by default - a passing assertion does not override that. Enable **Ignore Status**
(`Assertion.assume_success = true`) **on that branch only**, leaving it `false` on the main branch.

**Trap 2 - Mixing an artificially fast branch into the main flow.** For example, an "account locked"
response returns very fast because it skips the password comparison entirely. Mixed in, it inflates
average throughput to something flattering and meaningless. Split it with an **If Controller** keyed
on a label column in the CSV, with two separate samplers.

**Trap 3 - Logging in inside every loop iteration.** That mixes the transactional group's numbers
with the auth group's. Use a **setUp Thread Group** to collect N tokens into properties, and have the
main threads pick one by `ctx.getThreadNum() % N`.

---

## Step 5 - Smoke first, run for real second

**Always** do a small-scale trial run first. A misconfigured plan run straight at 10 minutes costs
10 minutes.

```bash
source env.sh
cd plans && jmeter -n -t <plan>.jmx -Jthreads=6 -Jrampup=3 -Jduration=15 \
  -l /tmp/smoke.jtl
awk -F',' 'NR>1{print $3", HTTP "$4", success="$8}' /tmp/smoke.jtl | sort | uniq -c
```

Check three things: did every sampler actually run - are the response codes the expected ones - is
any sample `success=false` unintentionally.

To see **which assertion** failed, re-run with XML output:

```bash
jmeter -n -t <plan>.jmx ... \
  -Jjmeter.save.saveservice.output_format=xml \
  -Jjmeter.save.saveservice.assertion_results=all -l /tmp/smoke.xml
```

---

## Step 6 - The real run, with resource monitoring

```bash
# 1. return the system to a clean state
./scripts/reset-db.sh              # or reset-lockout.js when only the lock needs clearing

# 2. start resource sampling in the background
TS=$(date -u +%Y%m%dT%H%M%SZ)
./scripts/monitor.sh "evidence/monitor/<scenario>-${TS}-resource.csv" 1 &

# 3. run - one command produces both the raw log and the dashboard
source env.sh && cd plans && jmeter -n -t <plan>.jmx \
  -l "../results/raw/<scenario>-${TS}.jtl" \
  -e -o "../results/html/<scenario>-${TS}/"

pkill -f monitor.sh
```

The `-o` directory must **not already exist** -> every run naturally gets its own folder and nothing
is ever overwritten.

### Two measurement mistakes already made

**Measuring CPU with `ps -o %cpu` is wrong.** That value is a cumulative average **since process
start**, so a 5-minute load burst gets diluted by all the idle time before it - the CPU column sits
flat at a meaningless number. Read `utime + stime` from `/proc/<pid>/stat` and take the delta between
two samples.

**`pgrep -f "node server.js"` without anchors matches the wrapping `bash` process** - its own command
line contains that very string. Use `pgrep -f '^node server\.js$'`, and add a guard that rejects any
PID whose RSS is implausibly small.

! This mistake **recurred** in a different script after it had already been written down. Re-read
the log before writing any `pgrep` command.

### Collect the full evidence set at that moment, never reconstruct it later

Raw `.jtl` - HTML directory - **a screenshot of the tool and the resource monitor IN THE SAME
FRAME** - hardware report. Once the run is over, it cannot be re-photographed.

---

## Step 7 - Analyse the raw log

Read `references/analysis-playbook.md` for the catalogue of common misinterpretations.

```bash
python3 scripts/jtl-stats.py summary  <file.jtl>          # per-sampler statistics
python3 scripts/jtl-stats.py errors   <file.jtl>          # error cause breakdown
python3 scripts/jtl-stats.py timeline <file.jtl> [secs]   # behaviour over time
python3 scripts/jtl-stats.py threads  <file.jtl> [secs]   # concurrency <-> latency
python3 scripts/jtl-stats.py steady   <file.jtl> [secs]   # steady-state throughput
```

**Always compute from the raw `.jtl`, never from the `statistics.json`** JMeter generates - every
number in the report must trace back to the original log.

### Three mandatory questions for every number

1. Does running the command actually produce that number?
2. Is the attributed cause verifiable, or just a plausible-sounding guess?
3. **Is this a limit of the system under test, or a limit of the measurement?**

Question 3 is where most errors live. A real example: the Load scenario measured 45 req/s - but that
was the ceiling imposed by **think-time** (50 threads / 1.6 s per iteration), not by the server. A
soak run against the same endpoint reached **997 req/s**, a gap of more than 20x.

---

## Final checklist

- [ ] Endpoint called for real with `curl`, not inferred from source
- [ ] Dedicated CSV for this endpoint group, with `expect_*` columns and a few poison rows
- [ ] Plan has >= 3 assertion types; think-time and ramp-up defensible in words
- [ ] Smoke run completed before the real run
- [ ] State reset before the run
- [ ] Raw `.jtl` + HTML directory + resource CSV, all three present
- [ ] Screenshot of the tool and the resource monitor in one frame
- [ ] Every number in the report retrievable by command from the raw `.jtl`
- [ ] **Functional bugs** clearly separated from **performance issues**
