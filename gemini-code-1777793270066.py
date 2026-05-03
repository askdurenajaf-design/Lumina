import streamlit as st
import google.generativeai as genai

# Setup
genai.configure(api_key="AIzaSyB-befTXMuophz04-Pjx0o9mDCdIGrwzqU")
model = genai.GenerativeModel('gemini-1.5-flash')

st.title("📚 Student Homework Assistant")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User input
if prompt := st.chat_input("How can I help with your homework?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get AI response
    response = model.generate_content(prompt)
    with st.chat_message("assistant"):
        st.markdown(response.text)
    st.session_state.messages.append({"role": "assistant", "content": response.text})
