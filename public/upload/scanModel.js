/*
*@cb ģ��ִ����֮����ã����ڽ��մ�����Ϣ
*
* scanResult  ɨ��������
* scanResults ɨ�����洢����
* target      ɨ�����
*/
function(cb){ 
    var scanResult = {}; //ɨ����
    
    scanResult.target = target.ip; 
    scanResult.port = 80; 
    scanResult.level = 1; 
    scanResult.outPut = "output"; 
    
    scanResults.push(scanResult); 

	cb(null); //�д��򷵻ش�����Ϣ�����򷵻� !true
} 