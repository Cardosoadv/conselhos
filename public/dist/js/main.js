// Utility functions
const formatDate = (dateString) => {
	if (!dateString) return 'Data não disponível';
	const date = new Date(dateString);
	return date.toLocaleDateString('pt-BR');
};

const truncateText = (text, maxLength = 80) => {
	if (!text) return '';
	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Statistics rendering
const renderStatistics = (stats) => {
	return `
                <div class="row text-center g-3">
                    <div class="col-6">
                        <div class="stat-box">
                            <h3 class="mb-0 text-primary">${stats.total || 0}</h3>
                            <small class="text-muted">Total</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stat-box">
                            <h3 class="mb-0 text-info">${stats.com_repercussao_geral || 0}</h3>
                            <small class="text-muted">Rep. Geral</small>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="stat-box">
                            <h3 class="mb-0 text-success">${stats.com_recurso_repetitivo || 0}</h3>
                            <small class="text-muted">Rec. Repetitivo</small>
                        </div>
                    </div>
                </div>
            `;
};

// Jurisprudence list item rendering
const renderJurisprudenciaItem = (item) => {
	const badges = [];
	if (item.repercussao_geral) badges.push('<span class="badge bg-primary">RG</span>');
	if (item.recurso_repetitivo) badges.push('<span class="badge bg-info">RR</span>');

	return `
                <a href="${AppConfig.baseUrl}jurisprudencias/consultarJurisprudencia/${item.id}" 
                    class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <small class="text-primary fw-bold">${item.numero_processo}</small>
                            ${badges.length > 0 ? '<div class="mt-1">' + badges.join(' ') + '</div>' : ''}
                        </div>
                        ${item.relevancia_score > 0 ?
			`<span class="badge bg-warning text-dark ms-2">${item.relevancia_score}</span>`
			: ''}
                    </div>
                    ${item.tema ? `<small class="text-muted d-block mt-1">Tema: ${item.tema}</small>` : ''}
                </a>
            `;
};

// Fetch statistics
async function fetchEstatisticas() {
	try {
		const response = await fetch(`${AppConfig.baseUrl}jurisprudencias/estatisticas`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const result = await response.json();

		const container = document.getElementById('estatisticas');
		if (result.success && result.data) {
			container.innerHTML = renderStatistics(result.data);
		} else {
			throw new Error('Dados inválidos');
		}
	} catch (error) {
		handleFetchError(error, 'estatisticas', 'Erro ao carregar estatísticas');
	}
}

// Fetch most relevant jurisprudences
async function fetchMaisRelevantes() {
	try {
		const response = await fetch(`${AppConfig.baseUrl}jurisprudencias/maisRelevantes/5`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const result = await response.json();

		const container = document.getElementById('maisRelevantes');
		if (result.success && Array.isArray(result.data) && result.data.length > 0) {
			container.innerHTML = result.data.map(renderJurisprudenciaItem).join('');
		} else {
			container.innerHTML = '<div class="list-group-item text-muted">Nenhuma jurisprudência encontrada</div>';
		}
	} catch (error) {
		handleFetchError(error, 'maisRelevantes', 'Erro ao carregar jurisprudências');
	}
}

// Fetch recent jurisprudences
async function fetchMaisRecentes() {
	try {
		const response = await fetch(`${AppConfig.baseUrl}jurisprudencias/maisRecentes/5`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const result = await response.json();

		const container = document.getElementById('maisRecentes');
		if (result.success && Array.isArray(result.data) && result.data.length > 0) {
			container.innerHTML = result.data.map(renderJurisprudenciaItem).join('');
		} else {
			container.innerHTML = '<div class="list-group-item text-muted">Nenhuma jurisprudência encontrada</div>';
		}
	} catch (error) {
		handleFetchError(error, 'maisRecentes', 'Erro ao carregar jurisprudências');
	}
}

const createProcessLink = (numeroProcesso) => {
	return `${AppConfig.baseUrl}processos/editarpornumerodeprocesso/${numeroProcesso}`;
};

const handleFetchError = (error, elementId, message = 'Erro ao carregar informações') => {
	console.error('Erro:', error);
	const element = document.getElementById(elementId);
	if (element) {
		element.innerHTML = `
                    <div class="alert alert-danger mb-0">
                        <i class="bi bi-exclamation-triangle"></i> ${message}
                    </div>
                `;
	}
};

// Process data rendering
const renderProcessItem = (item) => `
            <a href="${createProcessLink(item.numero_processo)}" 
               class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <small class="text-primary fw-bold">${item.numero_processo}</small>
                        ${item.nome ? `<p class="mb-0 text-muted small">${item.nome}</p>` : ''}
                    </div>
                </div>
                <small class="text-muted">Data: ${formatDate(item.dataHora)}</small>
            </a>
        `;

const renderIntimacaoItem = (item) => `
            <a href="${createProcessLink(item.numero_processo)}" 
               class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <small class="text-primary fw-bold">${item.numero_processo}</small>
                        ${item.tipoComunicacao ? `<p class="mb-0 text-muted small">${item.tipoComunicacao}</p>` : ''}
                    </div>
                </div>
                <small class="text-muted">Data: ${formatDate(item.data_disponibilizacao)}</small>
            </a>
        `;

// Data fetching functions
async function fetchProcessos() {
	try {
		const response = await fetch(`${AppConfig.baseUrl}processos/processosmovimentados/30`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();

		const container = document.getElementById('processoMovimentados');
		if (Array.isArray(data) && data.length > 0) {
			container.innerHTML = data.map(renderProcessItem).join('');
		} else {
			container.innerHTML = '<div class="list-group-item text-muted">Nenhum processo encontrado</div>';
		}
	} catch (error) {
		handleFetchError(error, 'processoMovimentados', 'Erro ao carregar processos');
	}
}

async function fetchIntimacoes() {
	try {
		const response = await fetch(`${AppConfig.baseUrl}intimacoes/intimacoesporperiodo/30`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		const data = await response.json();

		const container = document.getElementById('intimacoes');
		if (Array.isArray(data) && data.length > 0) {
			container.innerHTML = data.map(renderIntimacaoItem).join('');
		} else {
			container.innerHTML = '<div class="list-group-item text-muted">Nenhuma intimação encontrada</div>';
		}
	} catch (error) {
		handleFetchError(error, 'intimacoes', 'Erro ao carregar intimações');
	}
}

// Checkbox selection
const selectAll = document.getElementById('selectAll');
const processCheckboxes = document.querySelectorAll('.processCheckbox');

selectAll.addEventListener('change', function () {
	processCheckboxes.forEach(checkbox => {
		checkbox.checked = this.checked;
	});
});

function excluirEmLote() {
	const form = document.getElementById('processosForm');
	const checkedBoxes = document.querySelectorAll('.processCheckbox:checked');

	if (checkedBoxes.length === 0) {
		alert('Selecione pelo menos um processo para excluir.');
		return;
	}

	if (confirm(`Tem certeza que deseja excluir ${checkedBoxes.length} processo(s) selecionado(s)?`)) {
		form.action = `${AppConfig.baseUrl}processos/excluirEmLote`;
		form.submit();
	}
}

// Contract list item rendering
const renderContratoItem = (item) => {
	return `
                <a href="${AppConfig.baseUrl}contratos/editar/${item.id_contrato}" 
                   class="list-group-item list-group-item-action">
                    <small class="text-primary fw-bold">ID: ${item.id_contrato}</small>
                    <p class="mb-1 small">${item.cliente_nome || 'Cliente Desconhecido'}</p>
                    <small class="text-muted d-block mt-1">
                        <i class="bi bi-calendar-x"></i> Vencimento: ${formatDate(item.data_fim)}
                    </small>
                </a>
            `;
};

// Fetch statistics (using mock or simplified data for demonstration)
async function fetchEstatisticasContratos() {
	try {
		// Simulating an API call to get statistics
		const response = await fetch(`${AppConfig.baseUrl}contratos/estatisticas`);
		let result = {};

		if (response.ok) {
			result = await response.json();
		} else {
			
		}

		const container = document.getElementById('estatisticasContratos');
		if (result.data) {
			container.innerHTML = renderStatistics(result.data);
		} else {
			throw new Error('Dados inválidos');
		}
	} catch (error) {
		handleFetchError(error, 'estatisticasContratos', 'Não foi possível carregar as estatísticas.');
	}
}

// Fetch upcoming contracts (Mock data for demonstration)
async function fetchContratosAVencer() {
	try {
		// Simulating an API call to get upcoming contracts (next 30 days)
		const response = await fetch(`${AppConfig.baseUrl}contratos/proximosAVencer/5`);
		let result = {};

		if (response.ok) {
			result = await response.json();
		} else {
			// Fallback mock data (using existing contract list for demo, adding a mock data_fim)
			// NOTE: In a real application, this should fetch actual upcoming contracts.
			const mockContratos = [];
			if (mockContratos.length > 0) {
				result.data = mockContratos.slice(0, 3).map((c, index) => ({
					...c,
					// Mocking a future date for demonstration
					data_fim: new Date(new Date().setDate(new Date().getDate() + (index * 5))).toISOString().split('T')[0]
				}));
			} else {
				result.data = [];
			}
		}

		const container = document.getElementById('contratosAVencer');
		const listData = result.data || [];

		if (listData.length > 0) {
			container.innerHTML = listData.map(renderContratoItem).join('');
		} else {
			container.innerHTML = '<div class="list-group-item text-muted">Nenhum contrato próximo de vencer.</div>';
		}
	} catch (error) {
		handleFetchError(error, 'contratosAVencer', 'Não foi possível carregar os contratos.');
	}
}