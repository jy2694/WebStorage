package com.teger.webstorage.webstorage;

import com.teger.webstorage.webstorage.properties.EncryptProperties;
import com.teger.webstorage.webstorage.properties.FileProperties;
import com.teger.webstorage.webstorage.properties.SessionProperties;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
@EnableConfigurationProperties({FileProperties.class, EncryptProperties.class, SessionProperties.class})
public class WebStorageApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebStorageApplication.class, args);
    }
    @Bean
    CommandLineRunner init(FileProperties properties) {
        return (args) -> {
            Files.createDirectories(Paths.get(properties.getSYSTEM_ROOT()));
        };
    }
}
