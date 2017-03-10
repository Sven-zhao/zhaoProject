package com.zhaoProject.springBoot.helper;

import com.zhaoProject.springBoot.domain.Address;
import com.zhaoProject.springBoot.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.concurrent.TimeUnit;

@Service
public class CommonHelper {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    public void test() throws Exception {
        stringRedisTemplate.opsForValue().set("aaa", "111");
        String out = stringRedisTemplate.opsForValue().get("aaa");
        System.out.println(out);
    }

    public void testObj() throws Exception {
        User user = new User(1L, "zhao", "jianping");
        ValueOperations<String, User> operations = redisTemplate.opsForValue();
        operations.set("com.neox", user);
        operations.set("com.neo.f", user, 1, TimeUnit.SECONDS);
        Thread.sleep(1000);
        //redisTemplate.delete("com.neo.f");
        boolean exists = redisTemplate.hasKey("com.neo.f");
        if (exists) {
            System.out.println("exists is true");
        } else {
            System.out.println("exists is false");
        }
    }


    @Cacheable(value = "usercache", keyGenerator = "wiselyKeyGenerator")
    public User findUser(Long id, String firstName, String lastName) {
        System.out.println("无缓存的时候调用这里");
        return new User(id, firstName, lastName);
    }

    @Cacheable(value = "addresscache", keyGenerator = "wiselyKeyGenerator")
    public Address findAddress(Long id, String province, String city) {
        System.out.println("无缓存的时候调用这里");
        return new Address(id, province, city);
    }


}
