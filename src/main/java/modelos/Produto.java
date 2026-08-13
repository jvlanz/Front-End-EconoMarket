package modelos;

public class Produto {
	private int id;
	private String descricao;
	private int idCategoria;
	private int idMedida;
	private String medida;

	public Produto() {
	}
	public Produto(String descricao, int idCategoria, int idMedida, String medida) {
		setDescricao(descricao);
		setIdCategoria(idCategoria);
		setIdMedida(idMedida);
		setMedida(medida);
	}
	public Produto(int id, String descricao, int idCategoria, int idMedida, String medida) {
		setId(id);
		setDescricao(descricao);
		setIdCategoria(idCategoria);
		setIdMedida(idMedida);
		setMedida(medida);
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
	public int getIdCategoria() {
		return idCategoria;
	}
	public void setIdCategoria(int idCategoria) {
		this.idCategoria = idCategoria;
	}
	public int getIdMedida() {
		return idMedida;
	}
	public void setIdMedida(int idMedida) {
		this.idMedida = idMedida;
	}
	public String getMedida() {
		return medida;
	}
	public void setMedida(String medida) {
		if (medida!=null && medida.length()>0)
			this.medida = medida;
	}

}