package modelos;

public class Categoria {
	private int id;
	private String categoria;

	public Categoria() {
	}
	public Categoria(String categoria) {
		setCategoria(categoria);
	}
	public Categoria(int id, String categoria) {
		setId(id);
		setCategoria(categoria);
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCategoria() {
		return categoria;
	}
	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

}