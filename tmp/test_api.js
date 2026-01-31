const testCreateModel = async () => {
  try {
    // 首先测试登录获取token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    if (!loginResponse.ok) {
      console.log('登录失败，尝试注册用户...')
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123'
        })
      })

      if (!registerResponse.ok) {
        console.log('注册也失败')
        return
      }

      const loginResponse2 = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      if (!loginResponse2.ok) {
        console.log('注册后登录失败')
        return
      }

      const loginData2 = await loginResponse2.json()
      console.log('登录成功:', loginData2)
      const token = loginData2.token

      // 测试创建AI模型
      const modelResponse = await fetch('http://localhost:5000/api/ai-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: '测试模型',
          apiKey: 'test-key',
          model: 'gpt-3.5-turbo',
          role: '你是一个专业的小说家'
        })
      })

      const modelData = await modelResponse.json()
      console.log('创建模型响应:', modelResponse.status, modelData)
      
    } else {
      const loginData = await loginResponse.json()
      console.log('登录成功:', loginData)
      const token = loginData.token

      // 测试创建AI模型
      const modelResponse = await fetch('http://localhost:5000/api/ai-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: '测试模型',
          apiKey: 'test-key',
          model: 'gpt-3.5-turbo',
          role: '你是一个专业的小说家'
        })
      })

      const modelData = await modelResponse.json()
      console.log('创建模型响应:', modelResponse.status, modelData)
    }

  } catch (error) {
    console.error('测试失败:', error)
  }
}

testCreateModel()