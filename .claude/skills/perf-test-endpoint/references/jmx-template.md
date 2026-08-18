# Khung XML `.jmx` và các bẫy cú pháp

JMeter 5.6.3. Các đoạn dưới đây đã chạy thật, copy dùng được ngay.

---

## Bộ khung tối thiểu

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="..." enabled="true">
      <stringProp name="TestPlan.comments">
        Ghi tham số VÀ LÝ DO chọn từng con số ngay tại đây.
        Người chấm đọc comment này trước khi đọc báo cáo.
      </stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments"
                   guiclass="ArgumentsPanel" testclass="Arguments" enabled="true">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
    </TestPlan>
    <hashTree>
      <!-- HeaderManager - ThreadGroup - CSVDataSet - Sampler - Assertion - Timer -->
      <!-- ResultCollector đặt NGANG HÀNG với ThreadGroup, không lồng bên trong -->
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

**Quy tắc `hashTree`:** mỗi phần tử được theo sau bởi đúng một `<hashTree>` chứa các phần tử con.
Lệch một cặp thẻ là JMeter báo lỗi parse mà không chỉ rõ dòng.

---

## Tham số hoá để chạy lại được nhiều mức tải

```xml
<stringProp name="ThreadGroup.num_threads">${__P(threads,50)}</stringProp>
<stringProp name="ThreadGroup.ramp_time">${__P(rampup,60)}</stringProp>
<stringProp name="ThreadGroup.duration">${__P(duration,300)}</stringProp>
<stringProp name="HTTPSampler.domain">${__P(host,localhost)}</stringProp>
<stringProp name="HTTPSampler.port">${__P(port,3000)}</stringProp>
```

Ghi đè khi chạy: `jmeter -n -t plan.jmx -Jthreads=800 -Jrampup=400`

Nhờ vậy **một plan dùng được cho cả smoke lẫn chạy thật lẫn leo thang**, không phải sửa file.

---

## CSV Data Set

```xml
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="..." enabled="true">
  <stringProp name="filename">../data/<group>.csv</stringProp>
  <stringProp name="fileEncoding">UTF-8</stringProp>
  <stringProp name="variableNames">col1,col2,col3</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp>
  <stringProp name="delimiter">,</stringProp>
  <boolProp name="quotedData">true</boolProp>
  <boolProp name="recycle">true</boolProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
</CSVDataSet>
```

- `filename` là **đường dẫn tương đối so với thư mục đang chạy lệnh** - chạy từ `plans/` thì dùng `../data/`
- `quotedData=true` bắt buộc nếu dữ liệu có dấu phẩy trong ô (ví dụ địa chỉ)
- `recycle=true` để CSV quay vòng khi hết dòng

---

## POST body JSON

```xml
<boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
<elementProp name="HTTPsampler.Arguments" elementType="Arguments">
  <collectionProp name="Arguments.arguments">
    <elementProp name="" elementType="HTTPArgument">
      <boolProp name="HTTPArgument.always_encode">false</boolProp>
      <stringProp name="Argument.value">{"email":"${email}","password":"${password}"}</stringProp>
      <stringProp name="Argument.metadata">=</stringProp>
    </elementProp>
  </collectionProp>
</elementProp>
```

Nhớ kèm `HeaderManager` đặt `Content-Type: application/json`, nếu không server sẽ nhận body rỗng.

---

## Các loại assertion

### Response Assertion - mã phản hồi

```xml
<ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="..." enabled="true">
  <collectionProp name="Asserion.test_strings">     <!-- LƯU Ý: JMeter viết sai chính tả "Asserion" -->
    <stringProp name="0">${expect_code}</stringProp>
  </collectionProp>
  <stringProp name="Assertion.custom_message">Thông báo khi trượt</stringProp>
  <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
  <boolProp name="Assertion.assume_success">false</boolProp>
  <intProp name="Assertion.test_type">1</intProp>
</ResponseAssertion>
```

| `test_type` | Nghĩa |
|---|---|
| 1 | Matches - regex khớp **toàn bộ** chuỗi. Dùng khi kỳ vọng có dạng `401\|403` |
| 2 | Contains |
| 8 | Equals |
| 16 | Substring |

! **`Assertion.assume_success` = Ignore Status.** Đặt `true` khi phản hồi 4xx là kết quả **mong
đợi** - nếu không, sample bị đánh lỗi dù assertion pass, và error rate của cả kịch bản sai.

### JSONPath Assertion

```xml
<JSONPathAssertion guiclass="JSONPathAssertionGui" testclass="JSONPathAssertion" testname="..." enabled="true">
  <stringProp name="JSON_PATH">$.token</stringProp>
  <stringProp name="EXPECTED_VALUE">^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$</stringProp>
  <boolProp name="JSONVALIDATION">true</boolProp>
  <boolProp name="ISREGEX">true</boolProp>
  <boolProp name="EXPECT_NULL">false</boolProp>
  <boolProp name="INVERT">false</boolProp>
</JSONPathAssertion>
```

Để `EXPECTED_VALUE` rỗng và `JSONVALIDATION=false` nếu chỉ cần kiểm **trường có tồn tại**.

### JSR223 Assertion - kiểm logic phức tạp

```xml
<JSR223Assertion guiclass="TestBeanGUI" testclass="JSR223Assertion" testname="..." enabled="true">
  <stringProp name="scriptLanguage">groovy</stringProp>
  <stringProp name="cacheKey">true</stringProp>
  <stringProp name="script">
import groovy.json.JsonSlurper

def headers = prev.getResponseHeaders().toLowerCase()
if (!headers.contains("application/json")) {
    AssertionResult.setFailure(true)
    AssertionResult.setFailureMessage("Không phải JSON (HTTP " + prev.getResponseCode() + ")")
    return
}
def payload = new JsonSlurper().parseText(prev.getResponseDataAsString())
if (payload.size() &lt; (vars.get("expect_min_count") as Integer)) {
    AssertionResult.setFailure(true)
    AssertionResult.setFailureMessage("Thiếu kết quả: " + payload.size())
}
  </stringProp>
</JSR223Assertion>
```

! Trong XML phải escape `<` thành `&lt;` và `&` thành `&amp;`. Đây là nguồn lỗi parse phổ biến nhất.
`cacheKey=true` để Groovy được biên dịch một lần thay vì mỗi request.

---

## setUp Thread Group lấy token dùng chung

```xml
<SetupThreadGroup guiclass="SetupThreadGroupGui" testclass="SetupThreadGroup" testname="..." enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">stoptest</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController"
               guiclass="LoopControlPanel" testclass="LoopController" enabled="true">
    <boolProp name="LoopController.continue_forever">false</boolProp>
    <stringProp name="LoopController.loops">50</stringProp>
  </elementProp>
  <stringProp name="ThreadGroup.num_threads">1</stringProp>
</SetupThreadGroup>
```

Trích và lưu token:

```xml
<JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" enabled="true">
  <stringProp name="JSONPostProcessor.referenceNames">tokenVal</stringProp>
  <stringProp name="JSONPostProcessor.jsonPathExprs">$.token</stringProp>
  <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
  <stringProp name="JSONPostProcessor.defaultValues">TOKEN_KHONG_LAY_DUOC</stringProp>
</JSONPostProcessor>
```

```groovy
// JSR223 PostProcessor - lưu vào properties để mọi Thread Group dùng chung
def n = ((props.get("tokenCount") ?: "0") as String) as Integer
n = n + 1
props.put("tokenCount", n.toString())
props.put("token_" + n, vars.get("tokenVal"))
```

```groovy
// JSR223 PreProcessor ở luồng chính - lấy token theo chỉ số luồng
def total = ((props.get("tokenCount") ?: "0") as String) as Integer
if (total < 1) { return }
vars.put("token", props.get("token_" + ((ctx.getThreadNum() % total) + 1)))
```

! `vars` là **biến cục bộ của từng luồng**, `props` mới dùng chung toàn test. Muốn truyền dữ liệu
giữa các Thread Group thì bắt buộc dùng `props`.

---

## If Controller - tách nhánh theo dữ liệu

```xml
<IfController guiclass="IfControllerPanel" testclass="IfController" testname="..." enabled="true">
  <stringProp name="IfController.condition">${__groovy(vars.get("label") == "valid",)}</stringProp>
  <boolProp name="IfController.evaluateAll">false</boolProp>
  <boolProp name="IfController.useExpression">true</boolProp>
</IfController>
```

Dấu phẩy cuối trong `__groovy(...,)` là **bắt buộc** - tham số thứ hai là tên biến lưu kết quả, để
trống nhưng dấu phẩy phải có.

---

## Listener

| Loại | `guiclass` |
|---|---|
| Summary Report | `SummaryReport` |
| Aggregate Report | `StatVisualizer` |
| View Results Tree | `ViewResultsFullVisualizer` |

```xml
<ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Summary Report" enabled="true">
  <boolProp name="ResultCollector.error_logging">false</boolProp>
  <objProp>
    <name>saveConfig</name>
    <value class="SampleSaveConfiguration">
      <time>true</time><latency>true</latency><timestamp>true</timestamp>
      <success>true</success><label>true</label><code>true</code>
      <message>true</message><threadName>true</threadName><dataType>true</dataType>
      <assertions>true</assertions><subresults>true</subresults>
      <responseData>false</responseData><samplerData>false</samplerData>
      <xml>false</xml><fieldNames>true</fieldNames>
      <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
      <bytes>true</bytes><sentBytes>true</sentBytes><url>true</url>
      <threadCounts>true</threadCounts><idleTime>true</idleTime><connectTime>true</connectTime>
    </value>
  </objProp>
  <stringProp name="filename">${__P(listenerfile,)}</stringProp>
</ResultCollector>
```

**Bắt buộc bật `threadCounts`** - không có cột `allThreads` thì không phân tích được đường cong bão
hoà theo mức đồng thời. **Để `responseData=false`** trừ khi đang gỡ lỗi: bật lên là `.jtl` phình
gấp hàng chục lần.

Đặt `filename` là `${__P(listenerfile,)}` (rỗng) để listener không tự ghi file - dùng cờ `-l` của
dòng lệnh cho gọn.
