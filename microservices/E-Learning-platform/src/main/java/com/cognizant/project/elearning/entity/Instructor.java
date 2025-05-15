package com.cognizant.project.elearning.entity;

import java.util.List;

//import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;



import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Instructor extends User{
	

	
	@OneToMany(cascade=CascadeType.ALL,orphanRemoval=true,mappedBy="instructorId")
	private List<Course> course;
	
	@OneToMany(mappedBy="instructorId" ,cascade=CascadeType.ALL,orphanRemoval=true)
	private List<Notification> notification;
}

