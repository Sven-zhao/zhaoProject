package com.zhaoProject.springBoot.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zhaoProject.springBoot.domain.PrizeBase;
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
        PrizeBase p = prizeService1.getById(2);
        model.addAttribute("prize", p);
        model.addAttribute("one", prizeService1.getNum());
        model.addAttribute("two", prizeService2.getNum());
        int rs = 1;
        for (PrizeService s : list) {
            rs += s.getNum();
        }
        model.addAttribute("size", rs);
        String json = JSON.toJSONString(p);
        model.addAttribute("json", json);
        JSONObject parse = JSON.parseObject(json);
        model.addAttribute("parse", parse.get("title"));
        return "/index/hello";
    }
}