import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [data, setData] = useState([])

  // Fetch initial data
  const fetchData = async () => {
    const { data: rows, error } = await supabase
      .from('photos')
      .select('*')
    if (error) console.error(error)
    else setData(rows)
  }

  useEffect(() => {
    fetchData()

    // Subscribe to real-time changes
    const subscription = supabase
      .from('photos')
      .on('*', payload => {
        console.log('Change received!', payload)
        fetchData() // Refresh table on any change
      })
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Supabase Real-Time Table</h1>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {Object.values(row).map((val, i) => <td key={i} data-label={Object.keys(row)[i]}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
