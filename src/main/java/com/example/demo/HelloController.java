package com.example.demo;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {

	@RequestMapping("/")
	public String index() {
		return "Hello1!";
	}

	@RequestMapping("/test")
	public String test() {
		return "test!";
	}

	@RequestMapping("/test2")
	public String test2() {
		return "test2d!";
	}

	@RequestMapping("/test3")
	public String test3() {
		return "tesddt3!";
	}
}