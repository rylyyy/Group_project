package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Task;
import com.example.demo.repository.TaskRepository;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allow requests from your React app (adjust as necessary)
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // GET /api/tasks returns all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // POST /api/tasks/log/{id} with payload { "minutes": 5 }
    // Updates the logged time of the task with the given id.
    @PostMapping("/log/{id}")
    public Task logTaskTime(@PathVariable Long id, @RequestBody LogRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.addLoggedTime(request.getMinutes());
        return taskRepository.save(task);
    }

    // Optionally, if you want an endpoint to create a new task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // A simple DTO for logging time
    public static class LogRequest {

        private Integer minutes;

        public Integer getMinutes() {
            return minutes;
        }

        public void setMinutes(Integer minutes) {
            this.minutes = minutes;
        }
    }
}
