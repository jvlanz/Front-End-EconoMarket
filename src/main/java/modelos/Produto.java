package modelos;

public class Produto {
	private int id;
	private String descricao;
	private int idMedida;
	private int idCategoria;

	public Produto() {
	}
	public Produto(String descricao, int idMedida, int idCategoria) {
		setDescricao(descricao);
		setIdMedida(idMedida);
		setIdCategoria(idCategoria);
	}
	public Produto(int id, String descricao, int idMedida, int idCategoria) {
		setId(id);
		setDescricao(descricao);
		setIdMedida(idMedida);
		setIdCategoria(idCategoria);
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		if (descricao!=null && descricao.length()>0)
			this.descricao = descricao;
	}
	public int getIdMedida() {
		return idMedida;
	}
	public void setIdMedida(int idMedida) {
		this.idMedida = idMedida;
	}
	public int getIdCategoria() {
		return idCategoria;
	}
	public void setIdCategoria(int idCategoria) {
		this.idCategoria = idCategoria;
	}

}