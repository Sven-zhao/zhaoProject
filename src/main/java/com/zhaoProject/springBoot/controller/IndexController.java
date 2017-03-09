package com.zhaoProject.springBoot.controller;

import com.zhaoProject.springBoot.service.PrizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@EnableAutoConfiguration
public class IndexController {

    @Autowired
    @Qualifier("PrizeService")
    PrizeService prizeService1;

    @Autowired
    @Qualifier("PrizeBaseService")
    PrizeService prizeService2;

    @Autowired
    List<PrizeService> list;

    @RequestMapping("/")
    public String greeting(Model model) {
        model.addAttribute("prize", prizeService1.getById(2));
        model.addAttribute("one", prizeService1.getNum());
        model.addAttribute("two", prizeService2.getNum());
        int rs = 1;
        for (PrizeService s : list) {
            rs += s.getNum();
        }
        model.addAttribute("size", rs);
        model.addAttribute("name", "我是超人！");
        return "/index/hello";
    }
}