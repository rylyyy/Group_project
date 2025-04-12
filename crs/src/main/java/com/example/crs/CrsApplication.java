package com.example.crs;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.example.crs.model.Task;
import com.example.crs.model.TaskRepository;

@SpringBootApplication
public class CrsApplication {
	public static void main(String[] args) {
		SpringApplication.run(CrsApplication.class, args);
	}

	@Bean
	@SuppressWarnings("unused")
	ApplicationRunner init(TaskRepository repository) {
		return args -> {
			repository.save(new Task("Software Engineering Project", "High", "Not Completed"));
		};
	}
}
