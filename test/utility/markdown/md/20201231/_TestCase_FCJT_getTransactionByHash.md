|用例编号|用例标题|预置条件<br>输入内容<br>预期结果|
|----------------|----------------|----------------|
|<a name="FCJT_getTransactionByHash_000010"></a>FCJT_getTransactionB<br>yHash_000010|查询有效交易哈希-底层币|**预置条件**`无`<br><br>**输入内容**`查询有效交易哈希，交易内容为底层币`<br><br>**预期结果**`返回正确的交易信息`|
|<a name="FCJT_getTransactionByHash_000020"></a>FCJT_getTransactionB<br>yHash_000020|查询有效交易哈希-token|**预置条件**`无`<br><br>**输入内容**`查询有效交易哈希，交易内容token`<br><br>**预期结果**`返回正确的交易信息`|
|<a name="FCJT_getTransactionByHash_000030"></a>FCJT_getTransactionB<br>yHash_000030|查询有效交易哈希-memos|**预置条件**`无`<br><br>**输入内容**`查询有效交易哈希，交易内容包含memos`<br><br>**预期结果**`返回正确的交易信息和memos`|
|<a name="FCJT_getTransactionByHash_000040"></a>FCJT_getTransactionB<br>yHash_000040|查询无效交易哈希|**预置条件**`无`<br><br>**输入内容**`查询无效交易哈希：数字、字符串、参数为空等`<br><br>**预期结果**`返回相应错误提示`|
|<a name="FCJT_getTransactionByHash_000010"></a>FCJT_getTransactionB<br>yHash_000010|有效交易哈希|**预置条件**`无`<br><br>**输入内容**`查询有效的交易哈希（发币的交易、发送币的交易、底层币、代币等）`<br><br>**预期结果**`返回详细的交易信息`|
|<a name="FCJT_getTransactionByHash_000020"></a>FCJT_getTransactionB<br>yHash_000020|无效交易哈希|**预置条件**`无`<br><br>**输入内容**`查询无效的交易哈希（不存在的交易哈希、乱码数字字符串等）`<br><br>**预期结果**`返回相应的提示信息`|
