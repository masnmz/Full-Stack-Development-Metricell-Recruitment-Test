using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody] Employee newEmployee)
        {
            using (var connection = new SqliteConnection("Data Source=SqliteDB.db"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "INSERT INTO Employees (Name, Value) VALUES ($name, $value)";
                command.Parameters.AddWithValue("$name", newEmployee.Name);
                command.Parameters.AddWithValue("$value", newEmployee.Value);
                command.ExecuteNonQuery();
            }
            return Ok();
        }

        [HttpDelete("{name}")]
        public IActionResult DeleteEmployee(string name)
        {
            using (var connection = new SqliteConnection("Data Source=SqliteDB.db"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "DELETE FROM Employees WHERE Name = $name";
                command.Parameters.AddWithValue("$name", name);
                command.ExecuteNonQuery();
            }
            return Ok();
        }

        [HttpPut]
        public IActionResult UpdateEmployee([FromBody] Employee updatedEmployee)
        {
            using (var connection = new SqliteConnection("Data Source=SqliteDB.db"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "UPDATE Employees SET Value = $value WHERE Name = $name";
                command.Parameters.AddWithValue("$name", updatedEmployee.Name);
                command.Parameters.AddWithValue("$value", updatedEmployee.Value);
                command.ExecuteNonQuery();
            }
            return Ok();
        }

        [HttpPost("increment-values")]
        public IActionResult IncrementValues()
        {
            using (var connection = new SqliteConnection("Data Source=SqliteDB.db"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
            UPDATE Employees
            SET Value = Value + 
                CASE 
                    WHEN Name LIKE 'E%' THEN 1
                    WHEN Name LIKE 'G%' THEN 10
                    ELSE 100
                END";
                command.ExecuteNonQuery();
            }
            return Ok();
        }

        [HttpGet("sum-values")]
        public IActionResult GetFilteredSums()
        {
            int total = 0;
            using (var connection = new SqliteConnection("Data Source=SqliteDB.db"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT SUM(Value) FROM Employees WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%'";
                var result = command.ExecuteScalar();
                if (result != DBNull.Value)
                {
                    total = Convert.ToInt32(result);
                }
            }

            if (total >= 11171)
            {
                return Ok(new { Sum = total, message = "" });
            }
            else
            { 
            return Ok(new { Sum = 0, message = "The Sum of the Values of the Names starts with A or B or C is less than 11171" });
            }
        }



    }
}
