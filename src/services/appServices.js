
const API_URL = 'http://localhost:5000';

export const setSignupInfo = async (signupData) => {
  try {
    const response = await fetch(`${API_URL}/signup-submit`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Signup failed:`, data.errorMessages);
      return data;
    }

    return data;
  } catch (error) {
    console.error(`Error setting signup info:`, error);
    throw error;
  }
};

export const setLoginInfo = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login-submit`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log the detailed error messages from backend
      console.error(`Login failed:`, data.errorMessages);
      return data;
    }

    return data;
  } catch (error) {
    console.error(`Error setting login info:`, error);
    throw error;
  }
}

export const uploadResume = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/resume/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });
    return response.json();
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
}

export const analysisResume = async (id) => {
  try {
    const analysisResponse = await fetch("http://localhost:5000/api/analyze/extract-skills",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          resumeId: id
        }),
      }
    );
    return analysisResponse.json();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const updateStats = async (resumeId) => {
  try {
    const response = await fetch(`${API_URL}/api/stats/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ resumeId }),
    });
    return response.json();
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
}

export const fetchMatchedJobs = async (resumeId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/jobs/match-real", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resumeId }),
    });

    console.log('Fetch Matched Jobs Response Status:', response);

    if (!response.ok) {
      throw new Error("Failed to fetch job matches");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching matched jobs:", error);
    throw error;
  }
};

export const fetchUserResumes = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/resume/my-resumes/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

export const downloadResume = async (resumeId, userId) => {
  try {
    const response = await fetch(`${API_URL}/api/resume/download/${resumeId}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.blob();
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;
  }
};

export const deleteResume = async(resumeId) => {
  try {
    const response = await fetch(`${API_URL}/api/resume/delete/${resumeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}

export const matchJob = async(resumeId, jobDescription) => {
  try{
    const response = await fetch('http://localhost:5000/api/analyze/match-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        resumeId,
        jobDescription,
      }),
    });
    return response.json();
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;  
  }
}

export const getName = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/user/name/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;
  }
}

export const getFirstName = async(userId) => {
  try{
    const response = await fetch(`${API_URL}/api/user/first-name/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json()
  
  }catch(error){
    console.error('Error downloading resume:', error);
    throw error;
  }
}

export const getLastName = async(userId) => {
  try{
    const response = await fetch(`${API_URL}/api/user/last-name/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json()
  
  }catch(error){
    console.error('Error downloading resume:', error);
    throw error;
  }
}

export const updateProfile = async(firstname, lastname) => {
  try{
    const response = await fetch(`${API_URL}/api/user/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({firstname, lastname})
    });
    return response.json(); 
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const deleteAccount = async(userId) => {
  try{
    const response = await fetch(`${API_URL}/api/user/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
  catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const getEmail = async(userId) => {
  try{
    const response = await fetch(`${API_URL}/api/user/email/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json()
  
  }catch(error){
    console.error('Error downloading resume:', error);
    throw error;
  }
}

export const setPassword = async(data) => {
  try{
    const response = await fetch(`${API_URL}/api/user/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({data})
    });
    return response.json(); 
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const setThemeBackend = async(theme) => {
  try{
    const response = await fetch(`${API_URL}/api/user/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({theme})
    });
    return response.json();
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const getThemeBackend = async() => {
  try{
    const response = await fetch(`${API_URL}/api/user/theme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const fetchInterviewQuestions = async (jobTitle) => {
  try{
    const response = await fetch(`${API_URL}/api/questions/${jobTitle}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}

export const aiResponse = async (jobTitle, activeQuestion, input) => {
  try{
    const response = await fetch(`${API_URL}/api/ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({jobTitle, activeQuestion, input})
    });
    return response.json();
  }catch(err){
    console.error('Error downloading resume:', err);
    throw err;
  }
}