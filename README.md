<b>scheduleアプリケーション</b><br>
日付とidと内容でスケージュール組んでmysqlサーバーになげるWebアプリケーション<br>
dbに入る<br>
$ mysql -u root -p<br>
パスワードtodosqlを入力<br>
mysql > ALTER USER root IDENTIFIED WITH mysql_native_password BY 'todosql';<br>
パスワードの認証方式変更<br>
mysql > SELECT user, host, plugin FROM mysql.user;<br>
変わったことを確認<br>
mysql > CREATE TABLE schedule(date DATE, id BIGINT, content text);<br>
テーブル作成<br>
<br>
いつかdocker-compose.yamlでできるようにしたい<br>
