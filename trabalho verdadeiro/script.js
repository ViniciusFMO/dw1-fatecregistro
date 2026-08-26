/* =========================================
   DADOS
========================================= */

let pacientes =
    JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

let medicos =
    JSON.parse(
        localStorage.getItem("medicos")
    ) || [];

let consultas =
    JSON.parse(
        localStorage.getItem("consultas")
    ) || [];

let prontuarios =
    JSON.parse(
        localStorage.getItem("prontuarios")
    ) || [];

let notificacoes =
    JSON.parse(
        localStorage.getItem("notificacoes")
    ) || [];


/* =========================================
   ELEMENTOS
========================================= */

const pages =
    document.querySelectorAll(".page");

const navButtons =
    document.querySelectorAll(".nav-button");

const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById("modalContent");

const modalClose =
    document.getElementById("modalClose");

const toast =
    document.getElementById("toast");


/* =========================================
   INICIAR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarNavegacao();

        configurarPerfil();

        configurarBotoes();

        configurarPesquisa();

        atualizarTudo();

    }
);


/* =========================================
   NAVEGAÇÃO
========================================= */

function configurarNavegacao() {

    navButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const pageId =
                    button.dataset.page;

                abrirPagina(pageId);

            }
        );

    });

}


function abrirPagina(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    navButtons.forEach(button => {

        button.classList.remove("active");

    });


    const page =
        document.getElementById(pageId);

    const button =
        document.querySelector(
            `[data-page="${pageId}"]`
        );


    if (page) {

        page.classList.add("active");

    }


    if (button) {

        button.classList.add("active");

    }

}


/* =========================================
   PERFIL
========================================= */

function configurarPerfil() {

    const profileButton =
        document.getElementById(
            "profileButton"
        );

    const profileMenu =
        document.getElementById(
            "profileMenu"
        );

    const notificationsButton =
        document.getElementById(
            "notificationsButton"
        );

    const notificationsPanel =
        document.getElementById(
            "notificationsPanel"
        );

    const clearNotifications =
        document.getElementById(
            "clearNotifications"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileMenu.classList.toggle("show");

            notificationsPanel.classList.remove(
                "show"
            );

        }
    );


    notificationsButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            notificationsPanel.classList.toggle(
                "show"
            );

        }
    );


    clearNotifications.addEventListener(
        "click",
        () => {

            notificacoes = [];

            salvarDados();

            atualizarNotificacoes();

            mostrarToast(
                "Notificações limpas."
            );

        }
    );


    logoutButton.addEventListener(
        "click",
        () => {

            mostrarToast(
                "Você saiu da conta."
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !profileMenu.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {

                profileMenu.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================
   BOTÕES
========================================= */

function configurarBotoes() {

    document
        .getElementById("novoPacienteButton")
        .addEventListener(
            "click",
            abrirModalPaciente
        );


    document
        .getElementById("novoMedicoButton")
        .addEventListener(
            "click",
            abrirModalMedico
        );


    document
        .getElementById("novaConsultaButton")
        .addEventListener(
            "click",
            abrirModalConsulta
        );


    document
        .getElementById("novoProntuarioButton")
        .addEventListener(
            "click",
            abrirModalProntuario
        );


    modalClose.addEventListener(
        "click",
        fecharModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                fecharModal();

            }

        }
    );

}


/* =========================================
   ATUALIZAR SISTEMA
========================================= */

function atualizarTudo() {

    atualizarDashboard();

    atualizarPacientes();

    atualizarMedicos();

    atualizarConsultas();

    atualizarProntuarios();

    atualizarNotificacoes();

}


/* =========================================
   SALVAR
========================================= */

function salvarDados() {

    localStorage.setItem(
        "pacientes",
        JSON.stringify(pacientes)
    );

    localStorage.setItem(
        "medicos",
        JSON.stringify(medicos)
    );

    localStorage.setItem(
        "consultas",
        JSON.stringify(consultas)
    );

    localStorage.setItem(
        "prontuarios",
        JSON.stringify(prontuarios)
    );

    localStorage.setItem(
        "notificacoes",
        JSON.stringify(notificacoes)
    );

}


/* =========================================
   DASHBOARD
========================================= */

function atualizarDashboard() {

    atualizarDashboardPacientes();

    atualizarDashboardMedicos();

    atualizarDashboardConsultas();

    atualizarDashboardProntuarios();

}


/* =========================================
   DASHBOARD PACIENTES
   SOMENTE O NOME
========================================= */

function atualizarDashboardPacientes() {

    const lista =
        document.getElementById(
            "dashboardPacientes"
        );

    lista.innerHTML = "";


    if (pacientes.length === 0) {

        lista.innerHTML = `
            <p class="dashboard-empty">
                Nenhum paciente.
            </p>
        `;

        return;

    }


    pacientes.forEach(paciente => {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-paciente";

        item.textContent =
            paciente.nome;

        lista.appendChild(item);

    });

}


/* =========================================
   DASHBOARD MÉDICOS
   NOME + STATUS
========================================= */

function atualizarDashboardMedicos() {

    const lista =
        document.getElementById(
            "dashboardMedicos"
        );

    lista.innerHTML = "";


    if (medicos.length === 0) {

        lista.innerHTML = `
            <p class="dashboard-empty">
                Nenhum médico.
            </p>
        `;

        return;

    }


    medicos.forEach(medico => {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-medico";


        const status =
            medico.status === "Em atendimento"
                ? "Em atendimento"
                : "Livre";


        const statusClass =
            status === "Em atendimento"
                ? "atendimento"
                : "livre";


        item.innerHTML = `

            <span
                class="dashboard-medico-nome"
            >
                ${escaparHTML(medico.nome)}
            </span>

            <span
                class="
                    dashboard-medico-status
                    ${statusClass}
                "
            >
                ${status}
            </span>

        `;


        lista.appendChild(item);

    });

}


/* =========================================
   DASHBOARD CONSULTAS
   HORÁRIO + DATA + PACIENTE
========================================= */

function atualizarDashboardConsultas() {

    const lista =
        document.getElementById(
            "dashboardConsultas"
        );

    lista.innerHTML = "";


    if (consultas.length === 0) {

        lista.innerHTML = `
            <p class="dashboard-empty">
                Nenhuma consulta.
            </p>
        `;

        return;

    }


    consultas.forEach(consulta => {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-consulta";


        item.innerHTML = `

            <span>
                ${escaparHTML(
                    consulta.hora
                )}
            </span>

            <span>
                ${formatarData(
                    consulta.data
                )}
            </span>

            <span>
                ${escaparHTML(
                    consulta.paciente
                )}
            </span>

        `;


        lista.appendChild(item);

    });

}


/* =========================================
   DASHBOARD PRONTUÁRIOS
   NOME + VER
========================================= */

function atualizarDashboardProntuarios() {

    const lista =
        document.getElementById(
            "dashboardProntuarios"
        );

    lista.innerHTML = "";


    if (prontuarios.length === 0) {

        lista.innerHTML = `
            <p class="dashboard-empty">
                Nenhum prontuário.
            </p>
        `;

        return;

    }


    prontuarios.forEach(prontuario => {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-prontuario";


        item.innerHTML = `

            <span>
                ${escaparHTML(
                    prontuario.paciente
                )}
            </span>

            <button
                type="button"
                class="dashboard-ver"
                onclick="
                    visualizarProntuario(
                        '${prontuario.id}'
                    )
                "
            >
                Ver
            </button>

        `;


        lista.appendChild(item);

    });

}


/* =========================================
   PACIENTES
========================================= */

function atualizarPacientes() {

    const tabela =
        document.getElementById(
            "pacientesTable"
        );

    tabela.innerHTML = "";


    if (pacientes.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-row"
                >
                    Nenhum paciente cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    pacientes.forEach(paciente => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${escaparHTML(paciente.nome)}
            </td>

            <td>
                ${escaparHTML(paciente.idade)}
            </td>

            <td>
                ${escaparHTML(paciente.telefone)}
            </td>

            <td>

                <button
                    class="table-button delete"
                    onclick="
                        excluirPaciente(
                            '${paciente.id}'
                        )
                    "
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =========================================
   MÉDICOS
========================================= */

function atualizarMedicos() {

    const tabela =
        document.getElementById(
            "medicosTable"
        );

    tabela.innerHTML = "";


    if (medicos.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-row"
                >
                    Nenhum médico cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    medicos.forEach(medico => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${escaparHTML(medico.nome)}
            </td>

            <td>
                ${escaparHTML(
                    medico.especialidade
                )}
            </td>

            <td>
                ${escaparHTML(
                    medico.status
                )}
            </td>

            <td>

                <button
                    class="table-button"
                    onclick="
                        alternarStatusMedico(
                            '${medico.id}'
                        )
                    "
                >
                    Alterar status
                </button>

                <button
                    class="table-button delete"
                    onclick="
                        excluirMedico(
                            '${medico.id}'
                        )
                    "
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =========================================
   CONSULTAS
========================================= */

function atualizarConsultas() {

    const tabela =
        document.getElementById(
            "consultasTable"
        );

    tabela.innerHTML = "";


    if (consultas.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-row"
                >
                    Nenhuma consulta cadastrada.
                </td>
            </tr>
        `;

        return;

    }


    consultas.forEach(consulta => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${escaparHTML(
                    consulta.hora
                )}
            </td>

            <td>
                ${formatarData(
                    consulta.data
                )}
            </td>

            <td>
                ${escaparHTML(
                    consulta.paciente
                )}
            </td>

            <td>
                ${escaparHTML(
                    consulta.medico
                )}
            </td>

            <td>
                ${escaparHTML(
                    consulta.status
                )}
            </td>

            <td>

                <button
                    class="table-button"
                    onclick="
                        finalizarConsulta(
                            '${consulta.id}'
                        )
                    "
                >
                    Finalizar
                </button>

                <button
                    class="table-button delete"
                    onclick="
                        excluirConsulta(
                            '${consulta.id}'
                        )
                    "
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =========================================
   PRONTUÁRIOS
========================================= */

function atualizarProntuarios() {

    const tabela =
        document.getElementById(
            "prontuariosTable"
        );

    tabela.innerHTML = "";


    if (prontuarios.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="empty-row"
                >
                    Nenhum prontuário cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    prontuarios.forEach(prontuario => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${escaparHTML(
                    prontuario.paciente
                )}
            </td>

            <td>
                ${formatarData(
                    prontuario.data
                )}
            </td>

            <td>

                <button
                    class="table-button"
                    onclick="
                        visualizarProntuario(
                            '${prontuario.id}'
                        )
                    "
                >
                    Ver
                </button>

                <button
                    class="table-button delete"
                    onclick="
                        excluirProntuario(
                            '${prontuario.id}'
                        )
                    "
                >
                    Excluir
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =========================================
   MODAL PACIENTE
========================================= */

function abrirModalPaciente() {

    abrirModal(`

        <h2 class="form-title">
            Novo paciente
        </h2>

        <form id="formPaciente">

            <div class="form-group">

                <label>Nome</label>

                <input
                    type="text"
                    id="pacienteNome"
                    required
                >

            </div>

            <div class="form-group">

                <label>Idade</label>

                <input
                    type="number"
                    id="pacienteIdade"
                    required
                >

            </div>

            <div class="form-group">

                <label>Telefone</label>

                <input
                    type="text"
                    id="pacienteTelefone"
                >

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("formPaciente")
        .addEventListener(
            "submit",
            salvarPaciente
        );

}


function salvarPaciente(event) {

    event.preventDefault();


    const paciente = {

        id: gerarId(),

        nome:
            document
                .getElementById("pacienteNome")
                .value
                .trim(),

        idade:
            document
                .getElementById("pacienteIdade")
                .value,

        telefone:
            document
                .getElementById("pacienteTelefone")
                .value
                .trim()

    };


    pacientes.push(paciente);

    adicionarNotificacao(
        `Novo paciente: ${paciente.nome}`
    );

    salvarDados();

    atualizarTudo();

    fecharModal();

    mostrarToast(
        "Paciente cadastrado."
    );

}


/* =========================================
   MODAL MÉDICO
========================================= */

function abrirModalMedico() {

    abrirModal(`

        <h2 class="form-title">
            Novo médico
        </h2>

        <form id="formMedico">

            <div class="form-group">

                <label>Nome</label>

                <input
                    type="text"
                    id="medicoNome"
                    required
                >

            </div>

            <div class="form-group">

                <label>Especialidade</label>

                <input
                    type="text"
                    id="medicoEspecialidade"
                >

            </div>

            <div class="form-group">

                <label>Status</label>

                <select id="medicoStatus">

                    <option value="Livre">
                        Livre
                    </option>

                    <option value="Em atendimento">
                        Em atendimento
                    </option>

                </select>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("formMedico")
        .addEventListener(
            "submit",
            salvarMedico
        );

}


function salvarMedico(event) {

    event.preventDefault();


    const medico = {

        id: gerarId(),

        nome:
            document
                .getElementById("medicoNome")
                .value
                .trim(),

        especialidade:
            document
                .getElementById(
                    "medicoEspecialidade"
                )
                .value
                .trim(),

        status:
            document
                .getElementById(
                    "medicoStatus"
                )
                .value

    };


    medicos.push(medico);

    adicionarNotificacao(
        `Novo médico: ${medico.nome}`
    );

    salvarDados();

    atualizarTudo();

    fecharModal();

    mostrarToast(
        "Médico cadastrado."
    );

}


/* =========================================
   MODAL CONSULTA
========================================= */

function abrirModalConsulta() {

    if (
        pacientes.length === 0 ||
        medicos.length === 0
    ) {

        mostrarToast(
            "Cadastre pelo menos um paciente e um médico."
        );

        return;

    }


    const pacientesOptions =
        pacientes
            .map(paciente => `

                <option
                    value="${escaparHTML(
                        paciente.nome
                    )}"
                >
                    ${escaparHTML(
                        paciente.nome
                    )}
                </option>

            `)
            .join("");


    const medicosOptions =
        medicos
            .map(medico => `

                <option
                    value="${escaparHTML(
                        medico.nome
                    )}"
                >
                    ${escaparHTML(
                        medico.nome
                    )}
                </option>

            `)
            .join("");


    abrirModal(`

        <h2 class="form-title">
            Nova consulta
        </h2>

        <form id="formConsulta">

            <div class="form-group">

                <label>Horário</label>

                <input
                    type="time"
                    id="consultaHora"
                    required
                >

            </div>

            <div class="form-group">

                <label>Data</label>

                <input
                    type="date"
                    id="consultaData"
                    required
                >

            </div>

            <div class="form-group">

                <label>Paciente</label>

                <select
                    id="consultaPaciente"
                    required
                >
                    ${pacientesOptions}
                </select>

            </div>

            <div class="form-group">

                <label>Médico</label>

                <select
                    id="consultaMedico"
                    required
                >
                    ${medicosOptions}
                </select>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("formConsulta")
        .addEventListener(
            "submit",
            salvarConsulta
        );

}


function salvarConsulta(event) {

    event.preventDefault();


    const medicoNome =
        document
            .getElementById("consultaMedico")
            .value;


    const consulta = {

        id: gerarId(),

        hora:
            document
                .getElementById("consultaHora")
                .value,

        data:
            document
                .getElementById("consultaData")
                .value,

        paciente:
            document
                .getElementById(
                    "consultaPaciente"
                )
                .value,

        medico:
            medicoNome,

        status:
            "Agendada"

    };


    const medico =
        medicos.find(
            item =>
                item.nome === medicoNome
        );


    if (medico) {

        medico.status =
            "Em atendimento";

    }


    consultas.push(consulta);

    adicionarNotificacao(
        `Nova consulta para ${consulta.paciente}`
    );

    salvarDados();

    atualizarTudo();

    fecharModal();

    mostrarToast(
        "Consulta cadastrada."
    );

}


/* =========================================
   MODAL PRONTUÁRIO
========================================= */

function abrirModalProntuario() {

    if (pacientes.length === 0) {

        mostrarToast(
            "Cadastre um paciente primeiro."
        );

        return;

    }


    const options =
        pacientes
            .map(paciente => `

                <option
                    value="${escaparHTML(
                        paciente.nome
                    )}"
                >
                    ${escaparHTML(
                        paciente.nome
                    )}
                </option>

            `)
            .join("");


    abrirModal(`

        <h2 class="form-title">
            Novo prontuário
        </h2>

        <form id="formProntuario">

            <div class="form-group">

                <label>Paciente</label>

                <select
                    id="prontuarioPaciente"
                    required
                >
                    ${options}
                </select>

            </div>

            <div class="form-group">

                <label>Diagnóstico</label>

                <textarea
                    id="prontuarioDiagnostico"
                ></textarea>

            </div>

            <div class="form-group">

                <label>Histórico médico</label>

                <textarea
                    id="prontuarioHistorico"
                ></textarea>

            </div>

            <div class="form-group">

                <label>Medicamento</label>

                <input
                    type="text"
                    id="prontuarioMedicamento"
                >

            </div>

            <div class="form-group">

                <label>Observações</label>

                <textarea
                    id="prontuarioObservacoes"
                ></textarea>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("formProntuario")
        .addEventListener(
            "submit",
            salvarProntuario
        );

}


function salvarProntuario(event) {

    event.preventDefault();


    const prontuario = {

        id: gerarId(),

        paciente:
            document
                .getElementById(
                    "prontuarioPaciente"
                )
                .value,

        diagnostico:
            document
                .getElementById(
                    "prontuarioDiagnostico"
                )
                .value,

        historico:
            document
                .getElementById(
                    "prontuarioHistorico"
                )
                .value,

        medicamento:
            document
                .getElementById(
                    "prontuarioMedicamento"
                )
                .value,

        observacoes:
            document
                .getElementById(
                    "prontuarioObservacoes"
                )
                .value,

        data:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    prontuarios.push(prontuario);

    adicionarNotificacao(
        `Novo prontuário de ${prontuario.paciente}`
    );

    salvarDados();

    atualizarTudo();

    fecharModal();

    mostrarToast(
        "Prontuário cadastrado."
    );

}


/* =========================================
   EXCLUIR PACIENTE
========================================= */

function excluirPaciente(id) {

    pacientes =
        pacientes.filter(
            paciente =>
                paciente.id !== id
        );

    salvarDados();

    atualizarTudo();

    mostrarToast(
        "Paciente excluído."
    );

}


/* =========================================
   EXCLUIR MÉDICO
========================================= */

function excluirMedico(id) {

    medicos =
        medicos.filter(
            medico =>
                medico.id !== id
        );

    salvarDados();

    atualizarTudo();

    mostrarToast(
        "Médico excluído."
    );

}


/* =========================================
   STATUS MÉDICO
========================================= */

function alternarStatusMedico(id) {

    const medico =
        medicos.find(
            item =>
                item.id === id
        );


    if (!medico) return;


    medico.status =
        medico.status === "Livre"
            ? "Em atendimento"
            : "Livre";


    salvarDados();

    atualizarTudo();

}


/* =========================================
   FINALIZAR CONSULTA
========================================= */

function finalizarConsulta(id) {

    const consulta =
        consultas.find(
            item =>
                item.id === id
        );


    if (!consulta) return;


    consulta.status =
        "Finalizada";


    const medico =
        medicos.find(
            item =>
                item.nome === consulta.medico
        );


    if (medico) {

        medico.status =
            "Livre";

    }


    salvarDados();

    atualizarTudo();

    mostrarToast(
        "Consulta finalizada."
    );

}


/* =========================================
   EXCLUIR CONSULTA
========================================= */

function excluirConsulta(id) {

    const consulta =
        consultas.find(
            item =>
                item.id === id
        );


    if (consulta) {

        const medico =
            medicos.find(
                item =>
                    item.nome === consulta.medico
            );


        if (medico) {

            medico.status =
                "Livre";

        }

    }


    consultas =
        consultas.filter(
            consulta =>
                consulta.id !== id
        );


    salvarDados();

    atualizarTudo();

    mostrarToast(
        "Consulta excluída."
    );

}


/* =========================================
   VER PRONTUÁRIO
========================================= */

function visualizarProntuario(id) {

    const prontuario =
        prontuarios.find(
            item =>
                item.id === id
        );


    if (!prontuario) return;


    abrirModal(`

        <h2 class="form-title">
            Prontuário
        </h2>

        <div class="form-group">

            <label>Paciente</label>

            <input
                value="${escaparHTML(
                    prontuario.paciente
                )}"
                readonly
            >

        </div>

        <div class="form-group">

            <label>Diagnóstico</label>

            <textarea readonly>${escaparHTML(
                prontuario.diagnostico
            )}</textarea>

        </div>

        <div class="form-group">

            <label>Histórico médico</label>

            <textarea readonly>${escaparHTML(
                prontuario.historico
            )}</textarea>

        </div>

        <div class="form-group">

            <label>Medicamento</label>

            <input
                value="${escaparHTML(
                    prontuario.medicamento
                )}"
                readonly
            >

        </div>

        <div class="form-group">

            <label>Observações</label>

            <textarea readonly>${escaparHTML(
                prontuario.observacoes
            )}</textarea>

        </div>

    `);

}


/* =========================================
   EXCLUIR PRONTUÁRIO
========================================= */

function excluirProntuario(id) {

    prontuarios =
        prontuarios.filter(
            prontuario =>
                prontuario.id !== id
        );


    salvarDados();

    atualizarTudo();

    mostrarToast(
        "Prontuário excluído."
    );

}


/* =========================================
   MODAL
========================================= */

function abrirModal(conteudo) {

    modalContent.innerHTML =
        conteudo;

    modal.classList.add("show");

}


function fecharModal() {

    modal.classList.remove("show");

    modalContent.innerHTML = "";

}


/* =========================================
   NOTIFICAÇÕES
========================================= */

function adicionarNotificacao(texto) {

    notificacoes.unshift({

        id: gerarId(),

        texto: texto,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    });

}


function atualizarNotificacoes() {

    const lista =
        document.getElementById(
            "notificationsList"
        );

    const count =
        document.getElementById(
            "notificationCount"
        );

    const dot =
        document.getElementById(
            "notificationDot"
        );


    count.textContent =
        notificacoes.length;


    if (notificacoes.length > 0) {

        dot.classList.add("show");

    } else {

        dot.classList.remove("show");

    }


    lista.innerHTML = "";


    if (notificacoes.length === 0) {

        lista.innerHTML = `
            <div class="notification-item">
                Nenhuma notificação.
            </div>
        `;

        return;

    }


    notificacoes.forEach(notificacao => {

        const item =
            document.createElement("div");

        item.className =
            "notification-item";


        item.innerHTML = `

            ${escaparHTML(
                notificacao.texto
            )}

            <span
                class="notification-time"
            >
                ${escaparHTML(
                    notificacao.data
                )}
            </span>

        `;


        lista.appendChild(item);

    });

}


/* =========================================
   PESQUISA
========================================= */

function configurarPesquisa() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    search.addEventListener(
        "input",
        () => {

            const termo =
                search.value
                    .toLowerCase()
                    .trim();


            filtrarTabela(
                "pacientesTable",
                termo
            );

            filtrarTabela(
                "medicosTable",
                termo
            );

            filtrarTabela(
                "consultasTable",
                termo
            );

            filtrarTabela(
                "prontuariosTable",
                termo
            );

        }
    );

}


function filtrarTabela(id, termo) {

    const tabela =
        document.getElementById(id);


    if (!tabela) return;


    const linhas =
        tabela.querySelectorAll("tr");


    linhas.forEach(linha => {

        const texto =
            linha.textContent
                .toLowerCase();


        linha.style.display =
            texto.includes(termo)
                ? ""
                : "none";

    });

}


/* =========================================
   UTILITÁRIOS
========================================= */

function gerarId() {

    return (
        Date.now()
            .toString(36)
        +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


function formatarData(data) {

    if (!data) return "";


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function mostrarToast(mensagem) {

    toast.textContent =
        mensagem;

    toast.classList.add("show");


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}