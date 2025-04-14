package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map; // For accessing the request body map

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Task;
import com.example.demo.repository.TaskRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    // Get All
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        try {
            List<Task> tasks = new ArrayList<>();
            taskRepository.findAll().forEach(tasks::add);
            if (tasks.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get One
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable("id") Long id) {
        try {
            return taskRepository.findById(id)
                    .map(task -> new ResponseEntity<>(task, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            Task _task = taskRepository.save(new Task(
                    task.getTitle(),
                    task.getPriority(),
                    task.getStatus(),
                    task.getTargetTime(),
                    task.getLoggedTime() // Already an int, so no null check is needed.
            ));
            return new ResponseEntity<>(_task, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id, @RequestBody Task taskDetails) {
        try {
            return taskRepository.findById(id).map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setPriority(taskDetails.getPriority());
                task.setStatus(taskDetails.getStatus());
                task.setTargetTime(taskDetails.getTargetTime());
                // Optionally update loggedTime here if you expect it to be updated manually as well.
                Task updatedTask = taskRepository.save(task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable("id") Long id) {
        try {
            if (taskRepository.existsById(id)) {
                taskRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Log Time for Task
    @PostMapping("/log/{id}")
    public ResponseEntity<Task> logTime(@PathVariable("id") Long id, @RequestBody Map<String, Integer> request) {
        try {
            int minutes = request.get("minutes");
            return taskRepository.findById(id).map(task -> {
                // Assume task.getLoggedTime() returns an Integer; add the new minutes.
                int currentLogged = task.getLoggedTime();
                task.setLoggedTime(currentLogged + minutes);
                Task updatedTask = taskRepository.save(task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
