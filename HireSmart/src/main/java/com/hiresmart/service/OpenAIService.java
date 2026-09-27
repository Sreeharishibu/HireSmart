package com.hiresmart.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

@Service
public class OpenAIService {

	private final OpenAIClient client;

	public OpenAIService(@Value("${openai.api.key}") String apiKey) {

		client = OpenAIOkHttpClient.builder().apiKey(apiKey).build();
	}

	public String testOpenAI() {

		ResponseCreateParams params = ResponseCreateParams.builder().model(ChatModel.GPT_5_2)
				.input("Say: HireSmart OpenAI connection successful").build();

		Response response = client.responses().create(params);

		return response.output().stream().flatMap(item -> item.message().stream())
				.flatMap(message -> message.content().stream()).flatMap(content -> content.outputText().stream())
				.map(outputText -> outputText.text()).findFirst().orElse("No response received");
	}
}