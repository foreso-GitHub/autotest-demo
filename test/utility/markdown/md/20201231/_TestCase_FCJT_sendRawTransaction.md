|用例编号|用例标题|预置条件<br>输入内容<br>预期结果|
|----------------|----------------|----------------|
|<a name="FCJT_sendRawTransaction_000010"></a>FCJT_sendRawTransact<br>ion_000010|有效的单个交易数据|**预置条件**`无`<br><br>**输入内容**`有效的单个交易数据`<br><br>**预期结果**`返回交易哈希，通过该哈希可以查询到详细的交易信息`|
|<a name="FCJT_sendRawTransaction_000020"></a>FCJT_sendRawTransact<br>ion_000020|无效的单个交易数据|**预置条件**`无`<br><br>**输入内容**`无效的单个交易数据`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_sendRawTransaction_000030"></a>FCJT_sendRawTransact<br>ion_000030|多个有效的交易数据|**预置条件**`无`<br><br>**输入内容**`多个有效的交易数据`<br><br>**预期结果**`返回多个交易哈希，通过哈希可以查询到详细的交易信息`|
|<a name="FCJT_sendRawTransaction_000040"></a>FCJT_sendRawTransact<br>ion_000040|多个无效的交易数据|**预置条件**`无`<br><br>**输入内容**`多个无效的交易数据`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_sendRawTransaction_000050"></a>FCJT_sendRawTransact<br>ion_000050|多个交易数据，部分有效部分无效|**预置条件**`无`<br><br>**输入内容**`多个交易数据，其中部分有效部分无效`<br><br>**预期结果**`有效的交易数据返回交易哈希，无效的交易数据返回相应的提示信息`|
|<a name="FCJT_sendRawTransaction_000060"></a>FCJT_sendRawTransact<br>ion_000060|大量交易数据测试_01|**预置条件**`无`<br><br>**输入内容**`输入上千、上万个有效的交易数据，测试大量交易数据是否有上限`<br><br>**预期结果**`达到某个上限时，交易可能失败并返回相应的提示信息；未达到某个上限时，交易都能成功`|
|<a name="FCJT_sendRawTransaction_000070"></a>FCJT_sendRawTransact<br>ion_000070|大量交易数据测试_02|**预置条件**`无`<br><br>**输入内容**`输入上万、几十万个无效的交易数据`<br><br>**预期结果**`返回相应的提示信息，并且系统不崩溃`|
