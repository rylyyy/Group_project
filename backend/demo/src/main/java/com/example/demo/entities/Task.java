package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer targetTime;
    private Integer loggedTime = 0;

    public Task() {
    }

    public Task(String title, Integer targetTime) {
        this.title = title;
        this.targetTime = targetTime;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getTargetTime() {
        return targetTime;
    }

    public void setTargetTime(Integer targetTime) {
        this.targetTime = targetTime;
    }

    public Integer getLoggedTime() {
        return loggedTime;
    }

    public void setLoggedTime(Integer loggedTime) {
        this.loggedTime = loggedTime;
    }

    // Increment the logged time by a given amount (in minutes)
    public void addLoggedTime(Integer minutes) {
        this.loggedTime += minutes;
    }

    @Override
    public String toString() {
        return "Task [id=" + id + ", title=" + title + ", targetTime=" + targetTime + ", loggedTime=" + loggedTime + "]";
    }
}
