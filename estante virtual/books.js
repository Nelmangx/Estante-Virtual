class Livro {
    constructor(titulo, status, categoria, notas) {
      this.titulo = titulo;
      this.status = status;
      this.categoria = categoria;""
      this.notas = notas;
    }
  
    atualizarStatus(novoStatus) {
      this.status = novoStatus;
    }
  
    editar(titulo, categoria, notas) {
      this.titulo = titulo;
      this.categoria = categoria;
      this.notas = notas;
    }
  }
  
  let livros = JSON.parse(localStorage.getItem('livros')) || [];
  const form = document.getElementById('bookForm');
  const bookList = document.getElementById('bookList');
  const searchInput = document.getElementById('searchInput');
  let filtroStatus = 'todos';
  let editandoIndex = null;
  
  function renderLivros(filtro = '') {
    bookList.innerHTML = '';
    livros
      .filter((livro, index) => {
        const tituloMatch = livro.titulo.toLowerCase().includes(filtro.toLowerCase());
        const statusMatch = filtroStatus === 'todos' || livro.status === filtroStatus;
        return tituloMatch && statusMatch;
      })
      .forEach((livro, index) => {
        const li = document.createElement('li');
        li.className = `list-group-item status-${livro.status.replace(' ', '-')}`;
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5>${livro.titulo}</h5>
              <p><strong>Status:</strong> ${livro.status} | <strong>Categoria:</strong> ${livro.categoria}</p>
              <p><strong>Notas:</strong> ${livro.notas || '—'}</p>
              <div class="btn-group btn-group-sm mt-2">
                <button class="btn btn-success" onclick="marcarComo(${index}, 'lido')">✔️ Lido</button>
                <button class="btn btn-info" onclick="marcarComo(${index}, 'comprado')">🛒 Comprado</button>
                <button class="btn btn-warning" onclick="editarLivro(${index})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="removerLivro(${index})">🗑️ Remover</button>
              </div>
            </div>
          </div>
        `;
        bookList.appendChild(li);
      });
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('title').value.trim();
    const status = document.getElementById('status').value;
    const categoria = document.getElementById('category').value;
    const notas = document.getElementById('notes').value.trim();
  
    if (titulo) {
      if (editandoIndex !== null) {
        livros[editandoIndex].editar(titulo, categoria, notas);
        livros[editandoIndex].status = status;
        editandoIndex = null;
      } else {
        const novoLivro = new Livro(titulo, status, categoria, notas);
        livros.push(novoLivro);
      }
      localStorage.setItem('livros', JSON.stringify(livros));
      renderLivros();
      form.reset();
    }
  });
  
  function editarLivro(index) {
    const livro = livros[index];
    document.getElementById('title').value = livro.titulo;
    document.getElementById('status').value = livro.status;
    document.getElementById('category').value = livro.categoria;
    document.getElementById('notes').value = livro.notas;
    editandoIndex = index;
  }
  
  function marcarComo(index, novoStatus) {
    livros[index].atualizarStatus(novoStatus);
    localStorage.setItem('livros', JSON.stringify(livros));
    renderLivros(searchInput.value);
  }
  
  function removerLivro(index) {
    livros.splice(index, 1);
    localStorage.setItem('livros', JSON.stringify(livros));
    renderLivros(searchInput.value);
  }
  
  searchInput.addEventListener('input', () => {
    renderLivros(searchInput.value);
  });
  
  function aplicarFiltroStatus(status) {
    filtroStatus = status;
    renderLivros(searchInput.value);
  }
  
  renderLivros();
  