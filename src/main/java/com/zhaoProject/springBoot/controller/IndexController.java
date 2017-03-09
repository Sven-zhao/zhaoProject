package com.zhaoProject.springBoot.controller;

import com.zhaoProject.springBoot.service.PrizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@EnableAutoConfiguration
public class IndexController {
    @Autowired
    PrizeService prizeService;

    @RequestMapping("/")
    public String greeting(Model model) {
        model.addAttribute("prize", prizeService.getById(2));
        model.addAttribute("name", "我是超人！");
        return "hello";
    }
}