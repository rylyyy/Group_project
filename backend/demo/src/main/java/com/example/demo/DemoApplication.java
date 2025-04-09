package com.example.demo;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.entities.Task;
import com.example.demo.repository.TaskRepository;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public ApplicationRunner init(TaskRepository repository) {
        return args -> {
            repository.save(new Task("Write report", 60));       // 60 minutes target
            repository.save(new Task("Study mathematics", 45));   // 45 minutes target
            repository.save(new Task("Read chapter 5", 30));        // 30 minutes target

            // Print all tasks to the console
            repository.findAll().forEach(System.out::println);
        };
    }
}
