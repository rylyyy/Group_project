package com.example.demo.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {

    // Fields
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "priority")
    private String priority;

    @Column(name = "status")
    private String status;

    @Column(name = "target_time")
    private int targetTime; // planned time (minutes)

    @Column(name = "logged_time")
    private int loggedTime; // accumulated worked minutes

    // Constructors
    // Default constructor: initializes loggedTime to 0
    public Task() {
        this.loggedTime = 0;
    }

    public Task(String title, String priority, String status, int targetTime, int loggedTime) {
        this.title = title;
        this.priority = priority;
        this.status = status;
        this.targetTime = targetTime;
        this.loggedTime = loggedTime;
    }

    // Overloaded constructor: loggedTime is set to 0 by default
    public Task(String title, String priority, String status, int targetTime) {
        this(title, priority, status, targetTime, 0);
    }

    // Getters/Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTargetTime() {
        return targetTime;
    }

    public void setTargetTime(int targetTime) {
        this.targetTime = targetTime;
    }

    public int getLoggedTime() {
        return loggedTime;
    }

    public void setLoggedTime(int loggedTime) {
        this.loggedTime = loggedTime;
    }

    // Utility method to add logged time
    public void addLoggedTime(int minutes) {
        this.loggedTime += minutes;
    }
}
