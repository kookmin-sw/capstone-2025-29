FROM eclipse-temurin:17-jre-alpine
COPY ./build/libs/*SNAPSHOT.jar project.jar
ENTRYPOINT ["java", "-jar", "/project.jar"]
