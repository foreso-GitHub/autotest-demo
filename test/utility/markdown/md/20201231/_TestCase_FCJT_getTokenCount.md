|用例编号|用例标题|预置条件<br>输入内容<br>预期结果|
|----------------|----------------|----------------|
|<a name="FCJT_getTokenCount_000010"></a>FCJT_getTokenCount_0<br>00010|无效的哈希参数_01|**预置条件**`无`<br><br>**输入内容**`哈希长度不够或者过长`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_getTokenCount_000020"></a>FCJT_getTokenCount_0<br>00020|无效的哈希参数_02|**预置条件**`无`<br><br>**输入内容**`哈希长度没问题，但是是不存在的token哈希`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_getTokenCount_000030"></a>FCJT_getTokenCount_0<br>00030|有效的哈希参数_01|**预置条件**`无`<br><br>**输入内容**`有效的Token Info的哈希`<br><br>**预期结果**`返回该种Token的当前数量`|
