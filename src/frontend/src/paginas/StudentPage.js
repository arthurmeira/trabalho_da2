import React, { useState, useEffect } from 'react';
import '../StudentPage.css'; // Importar o CSS

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parents: '',
    phone_number: '',
    special_needs: '',
    status: '',
    studentId: '', // Novo campo para o ID único do estudante
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [error, setError] = useState('');

  // Carregar estudantes ao montar o componente
  useEffect(() => {
    fetch('/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch(() => setError('Erro ao carregar estudantes'));
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para cadastrar ou editar um estudante
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `/students/${currentStudentId}` : '/students';
    const method = editMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editMode) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === currentStudentId ? data : student
            )
          );
        } else {
          setStudents((prevStudents) => [...prevStudents, data]);
        }
        setFormData({
          name: '',
          age: '',
          parents: '',
          phone_number: '',
          special_needs: '',
          status: '',
          studentId: '',
        });
        setEditMode(false);
        setCurrentStudentId(null);
        setError('');
      })
      .catch(() => setError('Erro ao salvar estudante.'));
  };

  // Função para excluir um estudante
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este estudante?')) {
      fetch(`/students/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setStudents(students.filter((student) => student._id !== id));
        })
        .catch(() => setError('Erro ao excluir estudante.'));
    }
  };

  // Função para editar um estudante
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      age: student.age,
      parents: student.parents,
      phone_number: student.phone_number,
      special_needs: student.special_needs,
      status: student.status,
      studentId: student.studentId,
    });
    setCurrentStudentId(student._id);
    setEditMode(true);
  };

  return (
    <div className="student-page-container">
      <h1>Gestão de Estudantes</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Idade"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="parents"
          placeholder="Pais ou Responsáveis"
          value={formData.parents}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Telefone"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="special_needs"
          placeholder="Necessidades Especiais"
          value={formData.special_needs}
          onChange={handleInputChange}
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione o Status</option>
          <option value="on">Ativo</option>
          <option value="off">Inativo</option>
        </select>
        <input
          type="text"
          name="studentId"
          placeholder="ID do Estudante (Opcional)"
          value={formData.studentId}
          onChange={handleInputChange}
        />
        <button type="submit" className="submit-btn">
          {editMode ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h2>Estudantes Cadastrados</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Pais/Responsáveis</th>
            <th>Telefone</th>
            <th>Necessidades Especiais</th>
            <th>Status</th>
            <th>ID Estudante</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.parents}</td>
              <td>{student.phone_number}</td>
              <td>{student.special_needs}</td>
              <td>{student.status}</td>
              <td>{student.studentId}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Editar</button>
                <button onClick={() => handleDelete(student._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPage;
