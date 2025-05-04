export const chatWithGemini = async (message) => {
    try {
      const response = await fetch('http://localhost:5001/gemini-chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si vous utilisez JWT
        },
        body: JSON.stringify({ message })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }
  
      return data;
    } catch (error) {
      console.error('Erreur réseau:', {
        message: error.message,
        stack: error.stack
      });
      return { 
        error: "Le service rencontre des difficultés. Réessayez plus tard.",
        status: 503
      };
    }
  };