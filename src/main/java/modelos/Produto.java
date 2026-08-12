package modelos;

public class Produto {
	private int id;
	private String descricao;
	private String medida;
	private int idCategoria;

	public Produto() {
	}
	public Produto(String descricao, String medida, int idCategoria) {
		setDescricao(descricao);
		setMedida(medida);
		setIdCategoria(idCategoria);
	}
	public Produto(int id, String descricao, String medida, int idCategoria) {
		setId(id);
		setDescricao(descricao);
		setMedida(medida);
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
	public String getMedida() {
		return medida;
	}
	public void setMedida(String medida) {
		if (medida!=null && medida.length()>0)
			this.medida = medida;
	}
	public int getIdCategoria() {
		return idCategoria;
	}
	public void setIdCategoria(int idCategoria) {
		this.idCategoria = idCategoria;
	}

}