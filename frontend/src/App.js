import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase.from('tu_tabla').select('*');
    if (error) console.log("Error:", error);
    else setItems(data);
  }

  return (
    <div>
      <h1>Mi App conectada a Supabase</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;