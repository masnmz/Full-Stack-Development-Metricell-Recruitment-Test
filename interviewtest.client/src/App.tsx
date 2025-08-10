import { useEffect, useState } from 'react';

function App() {
  const [employees, setEmployees] = useState<any[]>([]); 
  const [name, setName]  = useState('');
  const [value, setValue] = useState<string>('');
  const [sumValue, setSumValue] = useState<number | null>(null);
  const [sumMessage, setSumMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'value' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  useEffect(() => {
    checkConnectivity();
    fetchEmployees();
  }, []);

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    return sortOrder === 'asc'
      ? a.value - b.value
      : b.value - a.value;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Employees ({employees.length})</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      
  <thead>
    <tr>
    <th style={{
      textAlign: 'left' as const,
      padding: '8px',
      border: '1px solid #ccc',
      cursor: 'pointer',
      userSelect: 'none',
    }}
     onClick={() => handleSort('name')}
     >
      Name {getSortIcon('name')}
    </th>
    <th style={{
      textAlign: 'left' as const,
      padding: '8px',
      border: '1px solid #ccc',
      cursor: 'pointer',
      userSelect: 'none',
    }} 
    onClick={() => handleSort('value')}
    >
     Value {getSortIcon('value')}
      </th>
      <th style={{
        textAlign: 'left' as const,
        padding: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      >
        Actions</th>
    </tr>
  </thead>
  <tbody>
    {sortedEmployees.map((e) => (
      <tr key={e.name}>
        <td style={{ padding: '8px', border: '1px solid #ccc' }}>{e.name}</td>
        <td style={{ padding: '8px', border: '1px solid #ccc' }}>{e.value}</td>
        <td style={{ padding: '8px', border: '1px solid #ccc' }}>
          <button
            style={{
              backgroundColor: '#F44336',
              color: 'white',
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '6px',
            }}
            onClick={() => deleteEmployee(e.name)}
          >
            Delete
          </button>
          <button
            style={{
              backgroundColor: '#42A5F5',
              color: 'white',
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => updateEmployee(e)}
          >
            Update
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
     

      <hr />

      <h3>➕ Add New Employee</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter the Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
      style={{
        backgroundColor: '#42A5F5',
        color: 'white',
        padding: '1px 2px',
        border: 'none',
        borderRadius: '2px', 
        cursor: 'pointer',
        marginLeft: '6px', 
      }}
      
      onClick={addEmployee}>Add
      </button>

      <hr />

      <h3>🤩 Special Operations</h3>
      <button 
      style={{ 
        backgroundColor: '#D4E157',
        color: 'white',
        padding: '1px 2px',
        border: 'none',
        borderRadius: '2px', 
        cursor: 'pointer',
      }} 
      onClick={incrementValues}>Increase Values</button>
      <button 
      style={{ 
        backgroundColor: '#FFA000',
        color: 'white',
        padding: '1px 2px',
        border: 'none',
        borderRadius: '2px', 
        cursor: 'pointer',
        marginLeft: '6px', 
      }} 
      
      onClick={getSumValues}>Show A or B or C Sum </button>

      {sumValue !== null && (
        <p style={{ color: sumValue === 0 ? 'red' : 'black' }}>
        {sumMessage && sumValue === 0 ? (
          <strong>{sumMessage}</strong>
        ) : (
          <>The Sum of the Values of the Names Starts with A or B or C: <strong>{sumValue}</strong></>
        )}
      </p>
      )}
    </div>
  );

  async function checkConnectivity() {
    const response = await fetch('/api/employees');
    const data = await response.json();
    //setEmployeeCount(data.length);
    setEmployees(data);
  }

  async function fetchEmployees() {
    const response = await fetch('/api/employees');
    const data = await response.json();
    setEmployees(data);
  }

  async function addEmployee() {
    // Do not add if the field is empty
    if (!name || !value) return;
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({name, value: Number(value) }),
    });
    setName('');
    setValue('');
    fetchEmployees();
  }

  async function deleteEmployee(name: string) {
    await fetch(`/api/employees/${name}`, {
      method: 'DELETE'
    });
    
    fetchEmployees();
  }

  async function updateEmployee(emp: any) {
    const newValue = prompt(`New Value(Current: ${emp.value}):`, emp.value);
    if (!newValue) return;

    await fetch('/api/employees', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: emp.name, value: Number(newValue) }),
    });
    fetchEmployees()
  }

  async function incrementValues() {
    await fetch('/api/employees/increment-values', {
      method: 'POST',
    });
    fetchEmployees();
  }
  async function getSumValues() {
    const response = await fetch('/api/employees/sum-values');
    const data = await response.json();
    setSumValue(data.sum);
    setSumMessage(data.message)
  }

  function handleSort(field: 'name' | 'value') {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function getSortIcon(field: 'name' | 'value') {
    if (sortField !== field) return '🔼🔽'; 
    return sortOrder === 'asc' ? '🔼' : '🔽';
  }
  

}

export default App;
