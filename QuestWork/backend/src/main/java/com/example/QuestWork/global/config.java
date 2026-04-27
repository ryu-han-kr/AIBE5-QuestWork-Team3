package com.example.QuestWork.global;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class config implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 紐⑤뱺 寃쎈줈?????
                .allowedOrigins("http://localhost:3000")
                .allowedHeaders("http://localhost:5173")
                //.allowedOriginPatterns("*") // ?뱀떆 紐곕씪 ?ｌ뼱???몃쾿, 紐⑤뱺 醫낅쪟???꾨찓?몄쓣 ??ok ?댁쨲
                .allowedMethods("GET", "POST", "PUT", "UPDATE", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*") // 紐⑤뱺 醫낅쪟??http ?ㅻ뜑瑜??덉슜, Content-type, Authorization ??
                .allowCredentials(true); // 紐⑤뱺 醫낅쪟???몄쬆諛⑹떇?대뱺 ?ъ슜???섏엳寃??댁쨲 JWT, session, cookies ??
    }
}
