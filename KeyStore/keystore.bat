@echo off
set curPath=%~dp0
c:
cd C:\Program Files\Java\jdk1.8.0_45\bin
keytool -v -list -keystore %curPath%keystore.keystore
pause
