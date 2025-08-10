import { useEffect, useState } from 'react';

function App() {
  const [employees, setEmployees] = useState<any[]>([]); 
  const [name, setName]  = useState('');
  const [value, setValue] = useState<string>('');
  const [sumValue, setSumValue] = useState<number | null>(null);
  const [sumMessage, setSumMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'value' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // To check API connectivity and fetch initial employees
  useEffect(() => {
    checkConnectivity();
    fetchEmployees();
  }, []);

  // Sorting Logic
  // To create sorted copy of the employees based on sortField and sortOrder 
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
      {/* PAGE TITLE STARTS */}
      <h2>📋 Employees ({employees.length})</h2>
      {/* PAGE TITLE ENDS */}

      {/* EMPLOYEE LIST (TABLE) STARTS */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        
      {/* TABLE HEADER STARTS */}    
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
      {/* TABLE HEADER ENDS */}

      {/* TABLE BODY STARTS */}
      <tbody>
        {sortedEmployees.map((e) => (
          // ROW STARTS
          <tr key={e.name}>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{e.name}</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>{e.value}</td>
            <td style={{ padding: '8px', border: '1px solid #ccc' }}>

              {/* DELETE BUTTON START */}
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
              {/* DELETE BUTTON ENDS */}

              {/* UPDATE BUTTON STARTS */}
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
              {/* UPDATE BUTTON ENDS */}
            </td>
          </tr>
          // ROW ENDS
        ))}
      </tbody>
      {/* TABLE BODY ENDS */}
    </table>
    {/* EMPLOYEE LIST (TABLE) ENDS */}
        

          <hr />
          {/* ADD EMPLOYEE FORM STARTS */}
          <h3>➕ Add New Employee</h3>
           {/* NAME INPUT STARTS */}
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
           {/* NAME INPUT ENDS */}

          {/* VALUE INPUT STARTS */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter the Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {/* VALUE INPUT END */}

          {/* ADD BUTTON STARTS */}
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
          {/* ADD BUTTON ENDS */}
          {/* ADD EMPLOYEE FORM ENDS */} 

          <hr />
           {/* SPECIAL OPERATIONS STARTS */}
          <h3>🤩 Special Operations</h3>

          {/* INCREASE VALUES BUTTON STARTS */}
          <button 
          style={{ 
            backgroundColor: '#D4E157',
            color: 'white',
            padding: '1px 2px',
            border: 'none',
            borderRadius: '2px', 
            cursor: 'pointer',
          }} 
          onClick={incrementValues}>Increase Values
          </button>
          {/* INCREASE VALUES BUTTON ENDS */}

           {/* SUM BUTTON STARTS */}
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
          
          onClick={getSumValues}>Show A or B or C Sum 
          </button>
          {/* SUM BUTTON ENDS */}
          {/* SPECIAL OPERATIONS ENDS */}


          {/* SUM RESULT STARTS */}
          {sumValue !== null && (
            <p style={{ color: sumValue === 0 ? 'red' : 'black' }}>
            {sumMessage && sumValue === 0 ? (
              <strong>{sumMessage}</strong>
            ) : (
              <>The Sum of the Values of the Names Starts with A or B or C: <strong>{sumValue}</strong></>
            )}
          </p>
          )}
          {/* SUM RESULT ENDS */}
        </div>
      );

   // FUNCTIONS

  // To check backend connectivity and update state.
  async function checkConnectivity() {
    const response = await fetch('/api/employees');
    const data = await response.json();
    //setEmployeeCount(data.length);
    setEmployees(data);
  }

  // To fetch employees list from backend and store in state.
  async function fetchEmployees() {
    const response = await fetch('/api/employees');
    const data = await response.json();
    setEmployees(data);
  }

  // Add a new employee by POST request.
  async function addEmployee() {
    // Do not add if the field is empty.
    if (!name || !value) return;
    await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({name, value: Number(value) }),
    });
    // To reset form inputs.
    setName('');
    setValue('');
    // To refresh employee list.
    fetchEmployees();
  }

  // To delete an employee by name
  async function deleteEmployee(name: string) {
    await fetch(`/api/employees/${name}`, {
      method: 'DELETE'
    });
    
    fetchEmployees();
  }

  // Prompt for a new value and update the employee's value.
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

  // To  perform the incerement operation on values on the end-point.
  async function incrementValues() {
    await fetch('/api/employees/increment-values', {
      method: 'POST',
    });
    fetchEmployees();
  }

  // To get sum of values for names starting with A, B, or C.
  async function getSumValues() {
    const response = await fetch('/api/employees/sum-values');
    const data = await response.json();
    setSumValue(data.sum);
    setSumMessage(data.message)
  }

  // To handle sorting logic when a column header is clicked.
  function handleSort(field: 'name' | 'value') {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  // To return the appropriate sort icon for a column.
  function getSortIcon(field: 'name' | 'value') {
    if (sortField !== field) return '🔼🔽'; 
    return sortOrder === 'asc' ? '🔼' : '🔽';
  }
  

}

export default App;
