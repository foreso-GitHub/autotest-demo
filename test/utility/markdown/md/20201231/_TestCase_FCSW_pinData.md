|用例编号|用例标题|预置条件<br>输入内容<br>预期结果|
|----------------|----------------|----------------|
|<a name="FCSW_pinData_000010"></a>FCSW_pinData_000010|单个无效的哈希参数_01|**预置条件**`无`<br><br>**输入内容**`哈希长度不够或者过长`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCSW_pinData_000020"></a>FCSW_pinData_000020|单个无效的哈希参数_02|**预置条件**`无`<br><br>**输入内容**`哈希长度没问题，但没有对应的上传数据`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCSW_pinData_000030"></a>FCSW_pinData_000030|单个有效的哈希参数|**预置条件**`无`<br><br>**输入内容**`有效的哈希参数`<br><br>**预期结果**`pin上传的数据成功`|
|<a name="FCSW_pinData_000040"></a>FCSW_pinData_000040|有效和无效混合的哈希参数_01|**预置条件**`无`<br><br>**输入内容**`输入多个哈希参数，其中部分是长度不够或过长的哈希参数，部分是有效的哈希参数`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCSW_pinData_000050"></a>FCSW_pinData_000050|有效和无效混合的哈希参数_02|**预置条件**`无`<br><br>**输入内容**`输入多个哈希参数，其中部分是没有对应上传数据的哈希参数，部分是有效的哈希参数`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCSW_pinData_000060"></a>FCSW_pinData_000060|哈希参数最多个数测试|**预置条件**`无`<br><br>**输入内容**`输入多个有效的哈希参数（个数可逐渐增加），测试哈希参数的个数是否有上限`<br><br>**预期结果**`pin上传的数据成功或返回相应的提示信息`|
|<a name="FCSW_pinData_000070"></a>FCSW_pinData_000070|多个有效的哈希参数|**预置条件**`无`<br><br>**输入内容**`输入多个有效的哈希参数`<br><br>**预期结果**`pin上传的数据成功`|