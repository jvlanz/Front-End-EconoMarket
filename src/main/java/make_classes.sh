#! /bin/sh

# aplicativo para compilar códigos java e mover classes resultantes para o diretório correto (WEB-INF)

for path in */ ; do
	javac $path/*.java
	mv $path/*.class ../webapp/WEB-INF/classes/$path
done
