|用例编号|用例标题|预置条件<br>输入内容<br>预期结果|
|----------------|----------------|----------------|
|<a name="FCJT_decryptFile_000010"></a>FCJT_decryptFile_000<br>010|无效的address参数_01|**预置条件**`无`<br><br>**输入内容**`address参数是一个不存在的地址`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000020"></a>FCJT_decryptFile_000<br>020|无效的address参数_02|**预置条件**`无`<br><br>**输入内容**`address参数是一个存在的地址，但是没有底层币`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000030"></a>FCJT_decryptFile_000<br>030|无效的secret参数_01|**预置条件**`无`<br><br>**输入内容**`secret参数位数不够、或过长、或不以s开头`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000040"></a>FCJT_decryptFile_000<br>040|无效的secret参数_02|**预置条件**`无`<br><br>**输入内容**`secret参数格式正确，但不是from地址正确的秘钥`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000050"></a>FCJT_decryptFile_000<br>050|无效的data参数_01|**预置条件**`无`<br><br>**输入内容**`data哈希长度不够或者过长`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000060"></a>FCJT_decryptFile_000<br>060|无效的data参数_02|**预置条件**`无`<br><br>**输入内容**`data哈希长度没问题，但没有对应的加密文件`<br><br>**预期结果**`返回相应的提示信息`|
|<a name="FCJT_decryptFile_000070"></a>FCJT_decryptFile_000<br>070|有效的文件解密测试|**预置条件**`无`<br><br>**输入内容**`所以参数都有效，data哈希有对应的加密文件`<br><br>**预期结果**`文件解密成功，返回对应数据内容的十六进制字符串`|
