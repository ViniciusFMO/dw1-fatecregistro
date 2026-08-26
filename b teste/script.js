/* =========================================================
   DADOS
========================================================= */

let pacientes =
    JSON.parse(localStorage.getItem("pacientes")) || [];

let medicos =
    JSON.parse(localStorage.getItem("medicos")) || [];

let consultas =
    JSON.parse(localStorage.getItem("consultas")) || [];

let prontuarios =
    JSON.parse(localStorage.getItem("prontuarios")) || [];

let internacoes =
    JSON.parse(localStorage.getItem("internacoes")) || [];

let medicamentos =
    JSON.parse(localStorage.getItem("medicamentos")) || [];

let exames =
    JSON.parse(localStorage.getItem("exames")) || [];


/* =========================================================
   USUÁRIO
========================================================= */

const usuarioPadrao = {
    usuario: "admin",
    senha: "1234",
    nome: "Administrador",
    cargo: "Administrador"
};


/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarTudo() {

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
        "internacoes",
        JSON.stringify(internacoes)
    );

    localStorage.setItem(
        "medicamentos",
        JSON.stringify(medicamentos)
    );

    localStorage.setItem(
        "exames",
        JSON.stringify(exames)
    );
}


/* =========================================================
   ID
========================================================= */

function novoID(lista) {

    if (lista.length === 0) {
        return 1;
    }

    return Math.max(
        ...lista.map(item => Number(item.id) || 0)
    ) + 1;
}


/* =========================================================
   TOAST
========================================================= */

function toast(msg) {

    const t =
        document.getElementById("toast");

    if (!t) {
        return;
    }

    t.innerText = msg;

    t.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            t.style.display = "none";

        }, 2500);
}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

    const totalPacientes =
        document.getElementById("totalPacientes");

    const totalMedicos =
        document.getElementById("totalMedicos");

    const totalConsultas =
        document.getElementById("totalConsultas");

    const totalProntuarios =
        document.getElementById("totalProntuarios");

    const totalInternados =
        document.getElementById("totalInternados");

    const totalExames =
        document.getElementById("totalExames");

    const totalMedicamentos =
        document.getElementById("totalMedicamentos");


    if (totalPacientes) {
        totalPacientes.innerText =
            pacientes.length;
    }

    if (totalMedicos) {
        totalMedicos.innerText =
            medicos.length;
    }

    if (totalConsultas) {
        totalConsultas.innerText =
            consultas.length;
    }

    if (totalProntuarios) {
        totalProntuarios.innerText =
            prontuarios.length;
    }

    if (totalInternados) {

        totalInternados.innerText =
            internacoes.filter(
                item =>
                    item.status !== "Alta"
            ).length;
    }

    if (totalExames) {

        totalExames.innerText =
            exames.filter(
                item =>
                    item.status !== "Concluído"
            ).length;
    }

    if (totalMedicamentos) {

        totalMedicamentos.innerText =
            medicamentos.length;
    }


    atualizarStatusMedicos();

    atualizarRelatorios();

    atualizarGrafico();

    atualizarNotificacoes();
}


/* =========================================================
   MENU
========================================================= */

const menus =
    document.querySelectorAll(".menu");

const paginas =
    document.querySelectorAll(".page");

menus.forEach(menu => {

    menu.addEventListener("click", () => {

        menus.forEach(item => {
            item.classList.remove("active");
        });

        paginas.forEach(pagina => {
            pagina.classList.remove("active");
        });

        menu.classList.add("active");

        const pagina =
            document.getElementById(
                menu.dataset.page
            );

        if (pagina) {
            pagina.classList.add("active");
        }

        const paginaAtual =
            document.getElementById(
                "paginaAtual"
            );

        if (paginaAtual) {

            paginaAtual.innerText =
                menu.querySelector("span")?.innerText ||
                menu.dataset.page;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});


/* =========================================================
   DARK MODE
========================================================= */

const dark =
    localStorage.getItem("dark");

if (dark === "true") {

    document.body.classList.add("dark");
}

const darkMode =
    document.getElementById("darkMode");

if (darkMode) {

    darkMode.addEventListener(
        "click",
        () => {

            document.body.classList.toggle("dark");

            localStorage.setItem(
                "dark",
                document.body.classList.contains("dark")
            );

            atualizarIconeTema();
        }
    );
}

function atualizarIconeTema() {

    const icon =
        darkMode?.querySelector("i");

    if (!icon) {
        return;
    }

    if (
        document.body.classList.contains("dark")
    ) {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-solid fa-moon";
    }
}

atualizarIconeTema();


/* =========================================================
   PESQUISA
========================================================= */

const pesquisa =
    document.getElementById("pesquisa");

if (pesquisa) {

    pesquisa.addEventListener(
        "keyup",
        () => {

            const texto =
                pesquisa.value
                    .toLowerCase()
                    .trim();

            document
                .querySelectorAll("tbody tr")
                .forEach(linha => {

                    linha.style.display =
                        linha.innerText
                            .toLowerCase()
                            .includes(texto)
                            ? ""
                            : "none";
                });
        }
    );
}


/* =========================================================
   EXPORTAÇÃO
========================================================= */

const exportar =
    document.getElementById("exportar");

if (exportar) {

    exportar.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const dados = {
                pacientes,
                medicos,
                consultas,
                prontuarios,
                internacoes,
                medicamentos,
                exames
            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            dados,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "hospital.json";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

            toast(
                "Dados exportados com sucesso."
            );
        }
    );
}


/* =========================================================
   LIMPAR BANCO
========================================================= */

const limpar =
    document.getElementById("limpar");

if (limpar) {

    limpar.addEventListener(
        "click",
        event => {

            event.preventDefault();

            if (
                !confirm(
                    "Deseja apagar todos os dados do sistema?"
                )
            ) {
                return;
            }

            pacientes = [];
            medicos = [];
            consultas = [];
            prontuarios = [];
            internacoes = [];
            medicamentos = [];
            exames = [];

            salvarTudo();

            localStorage.removeItem(
                "notificacoesVistas"
            );

            renderTodos();

            atualizarDashboard();

            toast(
                "Banco local limpo."
            );
        }
    );
}


/* =========================================================
   TROCAR TEMA
========================================================= */

const trocarTema =
    document.getElementById("trocarTema");

if (trocarTema) {

    trocarTema.addEventListener(
        "click",
        event => {

            event.preventDefault();

            document.body.classList.toggle("dark");

            localStorage.setItem(
                "dark",
                document.body.classList.contains("dark")
            );

            atualizarIconeTema();
        }
    );
}


/* =========================================================
   PACIENTES
========================================================= */

const formPaciente =
    document.getElementById("formPaciente");

const listaPacientes =
    document.getElementById("listaPacientes");


if (formPaciente) {

    formPaciente.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const id =
                document.getElementById(
                    "idPaciente"
                ).value;

            const nome =
                document.getElementById(
                    "nomePaciente"
                ).value.trim();

            const cpf =
                document.getElementById(
                    "cpfPaciente"
                ).value.trim();

            const idade =
                document.getElementById(
                    "idadePaciente"
                ).value.trim();

            const dataNascimento =
                document.getElementById(
                    "dataNascimento"
                ).value;

            const sexo =
                document.getElementById(
                    "sexo"
                ).value;

            const telefone =
                document.getElementById(
                    "telefonePaciente"
                ).value.trim();

            const tipoSanguineo =
                document.getElementById(
                    "tipoSanguineo"
                ).value.trim();

            const convenio =
                document.getElementById(
                    "convenio"
                ).value.trim();

            const alergias =
                document.getElementById(
                    "alergias"
                ).value.trim();


            if (
                !nome ||
                !cpf ||
                !idade
            ) {

                toast(
                    "Preencha nome, CPF e idade."
                );

                return;
            }


            if (id === "") {

                pacientes.push({

                    id: novoID(pacientes),

                    nome,
                    cpf,
                    idade,
                    dataNascimento,
                    sexo,
                    telefone,
                    tipoSanguineo,
                    convenio,
                    alergias,

                    criadoEm:
                        Date.now()
                });

                toast(
                    "Paciente cadastrado com sucesso."
                );

            } else {

                const paciente =
                    pacientes.find(
                        p =>
                            Number(p.id) ===
                            Number(id)
                    );

                if (!paciente) {
                    return;
                }

                paciente.nome =
                    nome;

                paciente.cpf =
                    cpf;

                paciente.idade =
                    idade;

                paciente.dataNascimento =
                    dataNascimento;

                paciente.sexo =
                    sexo;

                paciente.telefone =
                    telefone;

                paciente.tipoSanguineo =
                    tipoSanguineo;

                paciente.convenio =
                    convenio;

                paciente.alergias =
                    alergias;

                toast(
                    "Paciente atualizado com sucesso."
                );
            }


            salvarTudo();

            renderPacientes();

            atualizarDashboard();

            formPaciente.reset();

            document.getElementById(
                "idPaciente"
            ).value = "";

            document.querySelector(
                "#formPaciente button[type='submit']"
            ).innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i> Salvar Paciente';
        }
    );
}


function renderPacientes() {

    if (!listaPacientes) {
        return;
    }

    listaPacientes.innerHTML = "";

    pacientes.forEach(
        paciente => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `
                <td>${escaparHTML(paciente.id)}</td>

                <td>
                    ${escaparHTML(
                        paciente.nome || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        paciente.cpf || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        paciente.telefone ||
                        ""
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarPaciente(${Number(paciente.id)})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="excluirPaciente(${Number(paciente.id)})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </td>
            `;

            listaPacientes.appendChild(tr);
        }
    );
}


function editarPaciente(id) {

    const paciente =
        pacientes.find(
            p =>
                Number(p.id) ===
                Number(id)
        );

    if (!paciente) {
        return;
    }

    document.getElementById(
        "idPaciente"
    ).value = paciente.id;

    document.getElementById(
        "nomePaciente"
    ).value =
        paciente.nome || "";

    document.getElementById(
        "cpfPaciente"
    ).value =
        paciente.cpf || "";

    document.getElementById(
        "dataNascimento"
    ).value =
        paciente.dataNascimento || "";

    document.getElementById(
        "sexo"
    ).value =
        paciente.sexo || "";

    document.getElementById(
        "idadePaciente"
    ).value =
        paciente.idade || "";

    document.getElementById(
        "telefonePaciente"
    ).value =
        paciente.telefone || "";

    document.getElementById(
        "tipoSanguineo"
    ).value =
        paciente.tipoSanguineo || "";

    document.getElementById(
        "convenio"
    ).value =
        paciente.convenio || "";

    document.getElementById(
        "alergias"
    ).value =
        paciente.alergias || "";

    document.querySelector(
        "#formPaciente button[type='submit']"
    ).innerHTML =
        '<i class="fa-solid fa-rotate"></i> Atualizar Paciente';

    document.getElementById(
        "nomePaciente"
    ).focus();
}


function excluirPaciente(id) {

    if (
        !confirm(
            "Deseja realmente excluir este paciente?"
        )
    ) {
        return;
    }

    pacientes =
        pacientes.filter(
            p =>
                Number(p.id) !==
                Number(id)
        );

    salvarTudo();

    renderPacientes();

    atualizarDashboard();

    toast(
        "Paciente excluído."
    );
}

window.editarPaciente =
    editarPaciente;

window.excluirPaciente =
    excluirPaciente;


/* =========================================================
   MÉDICOS
========================================================= */

const formMedico =
    document.getElementById("formMedico");

const listaMedicos =
    document.getElementById("listaMedicos");


if (formMedico) {

    formMedico.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const nome =
                document.getElementById(
                    "nomeMedico"
                ).value.trim();

            const crm =
                document.getElementById(
                    "crm"
                ).value.trim();

            const especialidade =
                document.getElementById(
                    "especialidade"
                ).value.trim();

            const telefone =
                document.getElementById(
                    "telefoneMedico"
                ).value.trim();


            if (
                !nome ||
                !especialidade
            ) {

                toast(
                    "Preencha nome e especialidade."
                );

                return;
            }


            medicos.push({

                id:
                    novoID(medicos),

                nome,
                crm,
                especialidade,
                telefone,

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderMedicos();

            atualizarDashboard();

            formMedico.reset();

            toast(
                "Médico cadastrado com sucesso."
            );
        }
    );
}


function renderMedicos() {

    if (!listaMedicos) {
        return;
    }

    listaMedicos.innerHTML = "";

    medicos.forEach(
        medico => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `
                <td>${escaparHTML(medico.id)}</td>

                <td>
                    ${escaparHTML(
                        medico.nome || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        medico.crm || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        medico.especialidade || ""
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarMedico(${Number(medico.id)})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="excluirMedico(${Number(medico.id)})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </td>
            `;

            listaMedicos.appendChild(tr);
        }
    );
}


function editarMedico(id) {

    const medico =
        medicos.find(
            m =>
                Number(m.id) ===
                Number(id)
        );

    if (!medico) {
        return;
    }

    const novoNome =
        prompt(
            "Nome do médico:",
            medico.nome || ""
        );

    if (novoNome === null) {
        return;
    }

    const novoCRM =
        prompt(
            "CRM:",
            medico.crm || ""
        );

    if (novoCRM === null) {
        return;
    }

    const novaEspecialidade =
        prompt(
            "Especialidade:",
            medico.especialidade || ""
        );

    if (
        novaEspecialidade === null
    ) {
        return;
    }

    const novoTelefone =
        prompt(
            "Telefone:",
            medico.telefone || ""
        );

    if (
        novoTelefone === null
    ) {
        return;
    }

    if (
        !novoNome.trim() ||
        !novaEspecialidade.trim()
    ) {

        toast(
            "Dados inválidos."
        );

        return;
    }

    medico.nome =
        novoNome.trim();

    medico.crm =
        novoCRM.trim();

    medico.especialidade =
        novaEspecialidade.trim();

    medico.telefone =
        novoTelefone.trim();

    salvarTudo();

    renderMedicos();

    atualizarDashboard();

    toast(
        "Médico atualizado."
    );
}


function excluirMedico(id) {

    if (
        !confirm(
            "Deseja excluir este médico?"
        )
    ) {
        return;
    }

    medicos =
        medicos.filter(
            m =>
                Number(m.id) !==
                Number(id)
        );

    salvarTudo();

    renderMedicos();

    atualizarDashboard();

    toast(
        "Médico removido."
    );
}

window.editarMedico =
    editarMedico;

window.excluirMedico =
    excluirMedico;


/* =========================================================
   CONSULTAS
========================================================= */

const formConsulta =
    document.getElementById("formConsulta");

const listaConsultas =
    document.getElementById("listaConsultas");


if (formConsulta) {

    formConsulta.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const paciente =
                document.getElementById(
                    "pacienteConsulta"
                ).value.trim();

            const medico =
                document.getElementById(
                    "medicoConsulta"
                ).value.trim();

            const data =
                document.getElementById(
                    "dataConsulta"
                ).value;

            const hora =
                document.getElementById(
                    "horaConsulta"
                ).value;

            const status =
                document.getElementById(
                    "statusConsulta"
                ).value;


            if (
                !paciente ||
                !medico ||
                !data
            ) {

                toast(
                    "Preencha paciente, médico e data."
                );

                return;
            }


            consultas.push({

                id:
                    novoID(consultas),

                paciente,
                medico,
                data,
                hora,
                status,

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderConsultas();

            atualizarDashboard();

            formConsulta.reset();

            toast(
                "Consulta agendada."
            );
        }
    );
}


function renderConsultas() {

    if (!listaConsultas) {
        return;
    }

    listaConsultas.innerHTML = "";

    consultas.forEach(
        consulta => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `
                <td>${escaparHTML(consulta.id)}</td>

                <td>
                    ${escaparHTML(
                        consulta.paciente || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        consulta.medico || ""
                    )}
                </td>

                <td>
                    ${formatarData(
                        consulta.data
                    )}
                    ${escaparHTML(
                        consulta.hora || ""
                    )}
                </td>

                <td>
                    <span class="status">
                        ${escaparHTML(
                            consulta.status ||
                            "Agendada"
                        )}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarConsulta(${Number(consulta.id)})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="excluirConsulta(${Number(consulta.id)})"
                    >
                        <i class="fa-solid fa-ban"></i>
                        Cancelar
                    </button>

                </td>
            `;

            listaConsultas.appendChild(tr);
        }
    );
}


function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    if (
        partes.length !== 3
    ) {
        return data;
    }

    return `
        ${partes[2]}/${partes[1]}/${partes[0]}
    `;
}


function editarConsulta(id) {

    const consulta =
        consultas.find(
            c =>
                Number(c.id) ===
                Number(id)
        );

    if (!consulta) {
        return;
    }

    const paciente =
        prompt(
            "Nome do paciente:",
            consulta.paciente || ""
        );

    if (paciente === null) {
        return;
    }

    const medico =
        prompt(
            "Nome do médico:",
            consulta.medico || ""
        );

    if (medico === null) {
        return;
    }

    const data =
        prompt(
            "Data (AAAA-MM-DD):",
            consulta.data || ""
        );

    if (data === null) {
        return;
    }

    const hora =
        prompt(
            "Horário:",
            consulta.hora || ""
        );

    if (hora === null) {
        return;
    }

    const status =
        prompt(
            "Status:",
            consulta.status ||
            "Agendada"
        );

    if (status === null) {
        return;
    }

    consulta.paciente =
        paciente.trim();

    consulta.medico =
        medico.trim();

    consulta.data =
        data.trim();

    consulta.hora =
        hora.trim();

    consulta.status =
        status.trim();

    salvarTudo();

    renderConsultas();

    atualizarDashboard();

    toast(
        "Consulta atualizada."
    );
}


function excluirConsulta(id) {

    if (
        !confirm(
            "Cancelar esta consulta?"
        )
    ) {
        return;
    }

    consultas =
        consultas.filter(
            c =>
                Number(c.id) !==
                Number(id)
        );

    salvarTudo();

    renderConsultas();

    atualizarDashboard();

    toast(
        "Consulta cancelada."
    );
}

window.editarConsulta =
    editarConsulta;

window.excluirConsulta =
    excluirConsulta;


/* =========================================================
   PRONTUÁRIOS
========================================================= */

const formProntuario =
    document.getElementById(
        "formProntuario"
    );

const listaProntuarios =
    document.getElementById(
        "listaProntuarios"
    );


if (formProntuario) {

    formProntuario.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const paciente =
                document.getElementById(
                    "nomeProntuario"
                ).value.trim();

            const medico =
                document.getElementById(
                    "medicoProntuario"
                ).value.trim();

            const diagnostico =
                document.getElementById(
                    "diagnostico"
                ).value.trim();

            const historico =
                document.getElementById(
                    "historico"
                ).value.trim();

            const medicamentosTexto =
                document.getElementById(
                    "medicamentos"
                ).value.trim();

            const observacoes =
                document.getElementById(
                    "observacoes"
                ).value.trim();


            if (
                !paciente ||
                !diagnostico
            ) {

                toast(
                    "Preencha paciente e diagnóstico."
                );

                return;
            }


            prontuarios.push({

                id:
                    novoID(prontuarios),

                paciente,
                medico,
                diagnostico,

                historico,

                medicamentos:
                    medicamentosTexto,

                observacoes,

                data:
                    new Date()
                        .toLocaleDateString(
                            "pt-BR"
                        ),

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderProntuarios();

            atualizarDashboard();

            formProntuario.reset();

            toast(
                "Prontuário criado."
            );
        }
    );
}


function renderProntuarios() {

    if (!listaProntuarios) {
        return;
    }

    listaProntuarios.innerHTML = "";

    prontuarios.forEach(
        p => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `
                <td>
                    ${escaparHTML(p.id)}
                </td>

                <td>
                    ${escaparHTML(
                        p.paciente || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        p.diagnostico || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        p.data || ""
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="visualizarProntuario(${Number(p.id)})"
                    >
                        <i class="fa-solid fa-eye"></i>
                        Ver
                    </button>

                    <button
                        type="button"
                        onclick="editarProntuario(${Number(p.id)})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="excluirProntuario(${Number(p.id)})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </td>
            `;

            listaProntuarios.appendChild(tr);
        }
    );
}


/* =========================================================
   MODAL
========================================================= */

function abrirModal() {

    const modal =
        document.getElementById("modal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    modal.style.display = "flex";
}


function fecharModal() {

    const modal =
        document.getElementById("modal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.style.display = "none";

    const body =
        document.getElementById(
            "modalBody"
        );

    if (body) {
        body.innerHTML = "";
    }
}

window.fecharModal =
    fecharModal;


function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   VISUALIZAR PRONTUÁRIO
========================================================= */

function visualizarProntuario(id) {

    const p =
        prontuarios.find(
            x =>
                Number(x.id) ===
                Number(id)
        );

    if (!p) {
        return;
    }

    document.getElementById(
        "modalTitulo"
    ).innerText =
        "Prontuário do Paciente";


    document.getElementById(
        "modalBody"
    ).innerHTML = `

        <div class="dados-prontuario">

            <h3>Paciente</h3>

            <p>
                ${escaparHTML(
                    p.paciente ||
                    "Não informado"
                )}
            </p>


            <h3>Médico responsável</h3>

            <p>
                ${escaparHTML(
                    p.medico ||
                    "Não informado"
                )}
            </p>


            <h3>Diagnóstico</h3>

            <p>
                ${escaparHTML(
                    p.diagnostico ||
                    "Não informado"
                )}
            </p>


            <h3>Histórico Médico</h3>

            <p>
                ${escaparHTML(
                    p.historico ||
                    "Não informado"
                )}
            </p>


            <h3>Medicamentos</h3>

            <p>
                ${escaparHTML(
                    p.medicamentos ||
                    "Não informado"
                )}
            </p>


            <h3>Observações</h3>

            <p>
                ${escaparHTML(
                    p.observacoes ||
                    "Não informado"
                )}
            </p>


            <h3>Data</h3>

            <p>
                ${escaparHTML(
                    p.data ||
                    "Não informado"
                )}
            </p>

        </div>
    `;

    abrirModal();
}

window.visualizarProntuario =
    visualizarProntuario;


/* =========================================================
   EDITAR PRONTUÁRIO
========================================================= */

function editarProntuario(id) {

    const p =
        prontuarios.find(
            x =>
                Number(x.id) ===
                Number(id)
        );

    if (!p) {
        return;
    }

    document.getElementById(
        "modalTitulo"
    ).innerText =
        "Editar Prontuário";


    document.getElementById(
        "modalBody"
    ).innerHTML = `

        <label>Paciente</label>

        <input
            id="editPaciente"
            value="${escaparHTML(
                p.paciente || ""
            )}"
        >


        <label>Médico</label>

        <input
            id="editMedico"
            value="${escaparHTML(
                p.medico || ""
            )}"
        >


        <label>Diagnóstico</label>

        <textarea
            id="editDiagnostico"
        >${escaparHTML(
            p.diagnostico || ""
        )}</textarea>


        <label>Histórico Médico</label>

        <textarea
            id="editHistorico"
        >${escaparHTML(
            p.historico || ""
        )}</textarea>


        <label>Medicamentos</label>

        <textarea
            id="editMedicamentos"
        >${escaparHTML(
            p.medicamentos || ""
        )}</textarea>


        <label>Observações</label>

        <textarea
            id="editObservacoes"
        >${escaparHTML(
            p.observacoes || ""
        )}</textarea>


        <button
            type="button"
            onclick="salvarEdicaoProntuario(${Number(p.id)})"
        >
            <i class="fa-solid fa-floppy-disk"></i>
            Salvar Alterações
        </button>
    `;

    abrirModal();
}

window.editarProntuario =
    editarProntuario;


/* =========================================================
   SALVAR EDIÇÃO PRONTUÁRIO
========================================================= */

function salvarEdicaoProntuario(id) {

    const p =
        prontuarios.find(
            x =>
                Number(x.id) ===
                Number(id)
        );

    if (!p) {
        return;
    }

    const paciente =
        document.getElementById(
            "editPaciente"
        );

    const medico =
        document.getElementById(
            "editMedico"
        );

    const diagnostico =
        document.getElementById(
            "editDiagnostico"
        );

    const historico =
        document.getElementById(
            "editHistorico"
        );

    const medicamentosCampo =
        document.getElementById(
            "editMedicamentos"
        );

    const observacoes =
        document.getElementById(
            "editObservacoes"
        );


    if (
        !paciente ||
        !medico ||
        !diagnostico ||
        !historico ||
        !medicamentosCampo ||
        !observacoes
    ) {

        toast(
            "Erro ao carregar os campos."
        );

        return;
    }


    if (
        !paciente.value.trim() ||
        !diagnostico.value.trim()
    ) {

        toast(
            "Paciente e diagnóstico são obrigatórios."
        );

        return;
    }


    p.paciente =
        paciente.value.trim();

    p.medico =
        medico.value.trim();

    p.diagnostico =
        diagnostico.value.trim();

    p.historico =
        historico.value.trim();

    p.medicamentos =
        medicamentosCampo.value.trim();

    p.observacoes =
        observacoes.value.trim();


    salvarTudo();

    renderProntuarios();

    atualizarDashboard();

    fecharModal();

    toast(
        "Prontuário atualizado."
    );
}

window.salvarEdicaoProntuario =
    salvarEdicaoProntuario;


/* =========================================================
   EXCLUIR PRONTUÁRIO
========================================================= */

function excluirProntuario(id) {

    if (
        !confirm(
            "Excluir este prontuário?"
        )
    ) {
        return;
    }

    prontuarios =
        prontuarios.filter(
            p =>
                Number(p.id) !==
                Number(id)
        );

    salvarTudo();

    renderProntuarios();

    atualizarDashboard();

    toast(
        "Prontuário removido."
    );
}

window.excluirProntuario =
    excluirProntuario;


/* =========================================================
   INTERNAÇÃO
========================================================= */

const formInternacao =
    document.getElementById(
        "formInternacao"
    );

const listaInternacao =
    document.getElementById(
        "listaInternacao"
    );


if (formInternacao) {

    formInternacao.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const paciente =
                document.getElementById(
                    "pacienteInternacao"
                ).value.trim();

            const leito =
                document.getElementById(
                    "numeroLeito"
                ).value.trim();

            const setor =
                document.getElementById(
                    "setorInternacao"
                ).value;

            const data =
                document.getElementById(
                    "dataInternacao"
                ).value;


            if (
                !paciente ||
                !leito
            ) {

                toast(
                    "Informe paciente e número do leito."
                );

                return;
            }


            internacoes.push({

                id:
                    novoID(internacoes),

                paciente,
                leito,
                setor,

                data:
                    data ||
                    new Date()
                        .toISOString()
                        .split("T")[0],

                status:
                    "Internado",

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderInternacoes();

            atualizarDashboard();

            formInternacao.reset();

            toast(
                "Paciente internado."
            );
        }
    );
}


function renderInternacoes() {

    if (!listaInternacao) {
        return;
    }

    listaInternacao.innerHTML = "";

    internacoes.forEach(
        item => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    ${escaparHTML(item.id)}
                </td>

                <td>
                    ${escaparHTML(
                        item.paciente || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        item.leito || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        item.setor || ""
                    )}
                </td>

                <td>
                    <span class="status">
                        ${escaparHTML(
                            item.status ||
                            "Internado"
                        )}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="darAlta(${Number(item.id)})"
                    >
                        <i class="fa-solid fa-person-walking-arrow-right"></i>
                        Alta
                    </button>

                </td>
            `;

            listaInternacao.appendChild(tr);
        }
    );
}


function darAlta(id) {

    const item =
        internacoes.find(
            x =>
                Number(x.id) ===
                Number(id)
        );

    if (!item) {
        return;
    }

    item.status = "Alta";

    item.dataAlta =
        new Date()
            .toLocaleDateString(
                "pt-BR"
            );

    salvarTudo();

    renderInternacoes();

    atualizarDashboard();

    toast(
        "Alta médica registrada."
    );
}

window.darAlta =
    darAlta;


/* =========================================================
   FARMÁCIA
========================================================= */

const formMedicamento =
    document.getElementById(
        "formMedicamento"
    );

const listaMedicamentos =
    document.getElementById(
        "listaMedicamentos"
    );


if (formMedicamento) {

    formMedicamento.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const nome =
                document.getElementById(
                    "nomeMedicamento"
                ).value.trim();

            const quantidade =
                document.getElementById(
                    "quantidadeMedicamento"
                ).value;

            const laboratorio =
                document.getElementById(
                    "laboratorio"
                ).value.trim();

            const validade =
                document.getElementById(
                    "validadeMedicamento"
                ).value;


            if (
                !nome ||
                !quantidade
            ) {

                toast(
                    "Informe medicamento e quantidade."
                );

                return;
            }


            medicamentos.push({

                id:
                    novoID(medicamentos),

                nome,
                quantidade,
                laboratorio,
                validade,

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderMedicamentos();

            atualizarDashboard();

            formMedicamento.reset();

            toast(
                "Medicamento cadastrado."
            );
        }
    );
}


function renderMedicamentos() {

    if (!listaMedicamentos) {
        return;
    }

    listaMedicamentos.innerHTML = "";

    medicamentos.forEach(
        item => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    ${escaparHTML(item.id)}
                </td>

                <td>
                    ${escaparHTML(
                        item.nome || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        item.quantidade || ""
                    )}
                </td>

                <td>
                    ${formatarData(
                        item.validade
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="excluirMedicamento(${Number(item.id)})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </td>
            `;

            listaMedicamentos.appendChild(tr);
        }
    );
}


function excluirMedicamento(id) {

    if (
        !confirm(
            "Excluir este medicamento?"
        )
    ) {
        return;
    }

    medicamentos =
        medicamentos.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );

    salvarTudo();

    renderMedicamentos();

    atualizarDashboard();

    toast(
        "Medicamento excluído."
    );
}

window.excluirMedicamento =
    excluirMedicamento;


/* =========================================================
   EXAMES
========================================================= */

const formExame =
    document.getElementById(
        "formExame"
    );

const listaExames =
    document.getElementById(
        "listaExames"
    );


if (formExame) {

    formExame.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const paciente =
                document.getElementById(
                    "pacienteExame"
                ).value.trim();

            const tipo =
                document.getElementById(
                    "tipoExame"
                ).value.trim();

            const data =
                document.getElementById(
                    "dataExame"
                ).value;

            const status =
                document.getElementById(
                    "statusExame"
                ).value;


            if (
                !paciente ||
                !tipo
            ) {

                toast(
                    "Informe paciente e tipo de exame."
                );

                return;
            }


            exames.push({

                id:
                    novoID(exames),

                paciente,
                tipo,

                data:
                    data ||
                    new Date()
                        .toISOString()
                        .split("T")[0],

                status,

                criadoEm:
                    Date.now()
            });


            salvarTudo();

            renderExames();

            atualizarDashboard();

            formExame.reset();

            toast(
                "Exame cadastrado."
            );
        }
    );
}


function renderExames() {

    if (!listaExames) {
        return;
    }

    listaExames.innerHTML = "";

    exames.forEach(
        exame => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    ${escaparHTML(exame.id)}
                </td>

                <td>
                    ${escaparHTML(
                        exame.paciente || ""
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        exame.tipo || ""
                    )}
                </td>

                <td>
                    <span class="status">
                        ${escaparHTML(
                            exame.status ||
                            "Pendente"
                        )}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="excluirExame(${Number(exame.id)})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </td>
            `;

            listaExames.appendChild(tr);
        }
    );
}


function excluirExame(id) {

    if (
        !confirm(
            "Excluir este exame?"
        )
    ) {
        return;
    }

    exames =
        exames.filter(
            exame =>
                Number(exame.id) !==
                Number(id)
        );

    salvarTudo();

    renderExames();

    atualizarDashboard();

    toast(
        "Exame excluído."
    );
}

window.excluirExame =
    excluirExame;


/* =========================================================
   STATUS DOS MÉDICOS
========================================================= */

function atualizarStatusMedicos() {

    const livres =
        document.getElementById(
            "medicosLivres"
        );

    const atendimento =
        document.getElementById(
            "medicosAtendimento"
        );


    const emAtendimento =
        consultas.filter(
            consulta =>
                normalizar(
                    consulta.status
                ) ===
                "em atendimento"
        );


    const nomesEmAtendimento =
        new Set(
            emAtendimento.map(
                consulta =>
                    normalizar(
                        consulta.medico
                    )
            )
        );


    const medicosAtendimento =
        nomesEmAtendimento.size;


    const medicosLivres =
        medicos.filter(
            medico =>
                !nomesEmAtendimento.has(
                    normalizar(
                        medico.nome
                    )
                )
        ).length;


    if (livres) {
        livres.innerText =
            medicosLivres;
    }

    if (atendimento) {
        atendimento.innerText =
            medicosAtendimento;
    }
}


/* =========================================================
   RELATÓRIOS
========================================================= */

function atualizarRelatorios() {

    const atendimentos =
        document.getElementById(
            "relAtendimentos"
        );

    const altas =
        document.getElementById(
            "relAltas"
        );

    const ocupacao =
        document.getElementById(
            "relOcupacao"
        );


    if (atendimentos) {

        atendimentos.innerText =
            consultas.filter(
                consulta =>
                    [
                        "realizada",
                        "em atendimento"
                    ].includes(
                        normalizar(
                            consulta.status
                        )
                    )
            ).length;
    }


    if (altas) {

        altas.innerText =
            internacoes.filter(
                item =>
                    item.status ===
                    "Alta"
            ).length;
    }


    if (ocupacao) {

        const internados =
            internacoes.filter(
                item =>
                    item.status !==
                    "Alta"
            ).length;

        const totalLeitos =
            50;

        const percentual =
            Math.min(
                100,
                Math.round(
                    (
                        internados /
                        totalLeitos
                    ) * 100
                )
            );

        ocupacao.innerText =
            percentual + "%";
    }
}


/* =========================================================
   GRÁFICO
========================================================= */

let graficoHospital = null;

function atualizarGrafico() {

    const canvas =
        document.getElementById(
            "graficoHospital"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    const dados = [

        pacientes.length,

        medicos.length,

        consultas.length,

        prontuarios.length,

        internacoes.filter(
            item =>
                item.status !==
                "Alta"
        ).length,

        exames.filter(
            item =>
                item.status !==
                "Concluído"
        ).length,

        medicamentos.length
    ];


    if (graficoHospital) {
        graficoHospital.destroy();
    }


    const darkModeAtivo =
        document.body.classList.contains(
            "dark"
        );


    graficoHospital =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Pacientes",
                        "Médicos",
                        "Consultas",
                        "Prontuários",
                        "Internados",
                        "Exames",
                        "Medicamentos"
                    ],

                    datasets: [

                        {
                            label:
                                "Registros",

                            data: dados,

                            backgroundColor: [
                                "#2169a8",
                                "#16866d",
                                "#b7791f",
                                "#c24141",
                                "#64798c",
                                "#7654a6",
                                "#25a9c9"
                            ],

                            borderRadius: 5,

                            borderSkipped: false
                        }

                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    darkModeAtivo
                                        ? "#9aafc1"
                                        : "#718395",

                                font: {
                                    size: 9
                                }
                            }
                        },

                        y: {

                            beginAtZero: true,

                            ticks: {
                                color:
                                    darkModeAtivo
                                        ? "#9aafc1"
                                        : "#718395",

                                precision: 0,

                                font: {
                                    size: 9
                                }
                            },

                            grid: {
                                color:
                                    darkModeAtivo
                                        ? "#273d50"
                                        : "#edf1f4"
                            }
                        }

                    }
                }
            }
        );
}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

const notificationButton =
    document.getElementById(
        "notificationButton"
    );

const notificationsPanel =
    document.getElementById(
        "notificationsPanel"
    );

const perfilButton =
    document.getElementById(
        "perfilButton"
    );

const profileMenu =
    document.getElementById(
        "profileMenu"
    );


function normalizar(valor) {

    return String(
        valor || ""
    )
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function obterNotificacoes() {

    const notificacoes = [];


    /*
       NOVOS PACIENTES
    */

    pacientes.forEach(
        paciente => {

            notificacoes.push({

                id:
                    "paciente-" +
                    paciente.id,

                tipo:
                    "patient",

                icone:
                    "fa-user-plus",

                titulo:
                    "Novo paciente",

                texto:
                    `${paciente.nome || "Paciente"} foi cadastrado.`,

                data:
                    paciente.criadoEm ||
                    0
            });
        }
    );


    /*
       NOVOS MÉDICOS
    */

    medicos.forEach(
        medico => {

            notificacoes.push({

                id:
                    "medico-" +
                    medico.id,

                tipo:
                    "doctor",

                icone:
                    "fa-user-doctor",

                titulo:
                    "Novo médico",

                texto:
                    `${medico.nome || "Médico"} está cadastrado no sistema.`,

                data:
                    medico.criadoEm ||
                    0
            });
        }
    );


    /*
       NOVAS CONSULTAS
    */

    consultas.forEach(
        consulta => {

            notificacoes.push({

                id:
                    "consulta-" +
                    consulta.id,

                tipo:
                    "consultation",

                icone:
                    "fa-calendar-days",

                titulo:
                    "Nova consulta",

                texto:
                    `${consulta.paciente || "Paciente"} possui consulta com ${consulta.medico || "médico"}.`,

                data:
                    consulta.criadoEm ||
                    0
            });
        }
    );


    /*
       NOVOS PRONTUÁRIOS
    */

    prontuarios.forEach(
        prontuario => {

            notificacoes.push({

                id:
                    "prontuario-" +
                    prontuario.id,

                tipo:
                    "record",

                icone:
                    "fa-file-medical",

                titulo:
                    "Novo prontuário",

                texto:
                    `Novo prontuário registrado para ${prontuario.paciente || "paciente"}.`,

                data:
                    prontuario.criadoEm ||
                    0
            });
        }
    );


    /*
       MÉDICOS EM ATENDIMENTO
    */

    const emAtendimento =
        consultas.filter(
            consulta =>
                normalizar(
                    consulta.status
                ) ===
                "em atendimento"
        );


    emAtendimento.forEach(
        consulta => {

            notificacoes.push({

                id:
                    "atendimento-" +
                    consulta.id,

                tipo:
                    "doctor",

                icone:
                    "fa-stethoscope",

                titulo:
                    "Médico em atendimento",

                texto:
                    `${consulta.medico} está atendendo ${consulta.paciente}.`,

                data:
                    consulta.criadoEm ||
                    Date.now()
            });
        }
    );


    return notificacoes
        .sort(
            (a, b) =>
                Number(b.data || 0) -
                Number(a.data || 0)
        );
}


function obterNotificacoesVistas() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "notificacoesVistas"
            )
        ) || [];

    } catch (erro) {

        return [];
    }
}


function salvarNotificacoesVistas(lista) {

    localStorage.setItem(
        "notificacoesVistas",
        JSON.stringify(lista)
    );
}


function atualizarNotificacoes() {

    const notificacoes =
        obterNotificacoes();

    const vistas =
        obterNotificacoesVistas();


    const novas =
        notificacoes.filter(
            item =>
                !vistas.includes(
                    item.id
                )
        );


    const quantidade =
        novas.length;


    atualizarBadge(
        "notificationBadge",
        quantidade
    );

    atualizarBadge(
        "headerNotificationBadge",
        quantidade
    );


    const count =
        document.getElementById(
            "profileNotificationCount"
        );

    if (count) {
        count.innerText =
            quantidade;
    }


    const status =
        document.getElementById(
            "statusNotificacoes"
        );

    if (status) {
        status.innerText =
            quantidade;
    }


    const subtitle =
        document.getElementById(
            "notificationsSubtitle"
        );

    if (subtitle) {

        subtitle.innerText =
            quantidade === 0
                ? "Nenhuma notificação nova"
                : `${quantidade} notificação(ões) nova(s)`;
    }


    renderNotificacoes(
        notificacoes,
        vistas
    );
}


function atualizarBadge(id, quantidade) {

    const badge =
        document.getElementById(id);

    if (!badge) {
        return;
    }

    badge.innerText =
        quantidade;

    badge.classList.toggle(
        "zero",
        quantidade === 0
    );
}


function renderNotificacoes(
    notificacoes,
    vistas
) {

    const lista =
        document.getElementById(
            "notificationsList"
        );

    if (!lista) {
        return;
    }


    if (
        notificacoes.length === 0
    ) {

        lista.innerHTML = `

            <div class="empty-notifications">

                <i class="fa-regular fa-bell-slash"></i>

                Nenhuma notificação disponível.

            </div>
        `;

        return;
    }


    lista.innerHTML =
        notificacoes
            .slice(0, 30)
            .map(
                item => {

                    const nova =
                        !vistas.includes(
                            item.id
                        );

                    return `

                        <div
                            class="
                                notification-item
                                ${item.tipo}
                                ${nova ? "new" : ""}
                            "
                        >

                            <div class="notification-icon">

                                <i
                                    class="
                                        fa-solid
                                        ${item.icone}
                                    "
                                ></i>

                            </div>

                            <div class="notification-content">

                                <strong>
                                    ${escaparHTML(
                                        item.titulo
                                    )}
                                </strong>

                                <p>
                                    ${escaparHTML(
                                        item.texto
                                    )}
                                </p>

                                <small>
                                    ${formatarTempo(
                                        item.data
                                    )}
                                </small>

                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


function formatarTempo(timestamp) {

    if (!timestamp) {
        return "Agora";
    }

    const diferenca =
        Date.now() -
        Number(timestamp);


    if (
        diferenca <
        60 * 1000
    ) {
        return "Agora";
    }


    const minutos =
        Math.floor(
            diferenca /
            (60 * 1000)
        );


    if (
        minutos < 60
    ) {

        return `Há ${minutos} minuto(s)`;
    }


    const horas =
        Math.floor(
            minutos / 60
        );


    if (
        horas < 24
    ) {

        return `Há ${horas} hora(s)`;
    }


    const dias =
        Math.floor(
            horas / 24
        );


    return `Há ${dias} dia(s)`;
}


/* =========================================================
   ABRIR NOTIFICAÇÕES
========================================================= */

function abrirNotificacoes() {

    if (!notificationsPanel) {
        return;
    }

    notificationsPanel.classList.toggle(
        "active"
    );

    profileMenu?.classList.remove(
        "active"
    );
}


if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            abrirNotificacoes();
        }
    );
}


const abrirNotificacoesButton =
    document.getElementById(
        "abrirNotificacoes"
    );

if (
    abrirNotificacoesButton
) {

    abrirNotificacoesButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileMenu?.classList.remove(
                "active"
            );

            notificationsPanel?.classList.add(
                "active"
            );
        }
    );
}


/* =========================================================
   PERFIL
========================================================= */

if (perfilButton) {

    perfilButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileMenu?.classList.toggle(
                "active"
            );

            notificationsPanel?.classList.remove(
                "active"
            );
        }
    );
}


document.addEventListener(
    "click",
    event => {

        if (
            notificationsPanel &&
            !notificationsPanel.contains(
                event.target
            ) &&
            event.target !==
                notificationButton
        ) {

            notificationsPanel.classList.remove(
                "active"
            );
        }


        if (
            profileMenu &&
            !profileMenu.contains(
                event.target
            ) &&
            event.target !==
                perfilButton
        ) {

            profileMenu.classList.remove(
                "active"
            );
        }
    }
);


/* =========================================================
   MARCAR NOTIFICAÇÕES COMO LIDAS
========================================================= */

const marcarNotificacoesLidas =
    document.getElementById(
        "marcarNotificacoesLidas"
    );


if (
    marcarNotificacoesLidas
) {

    marcarNotificacoesLidas.addEventListener(
        "click",
        () => {

            const todas =
                obterNotificacoes();

            const ids =
                todas.map(
                    item =>
                        item.id
                );

            salvarNotificacoesVistas(
                ids
            );

            atualizarNotificacoes();

            toast(
                "Notificações marcadas como lidas."
            );
        }
    );
}


/* =========================================================
   MODAL - FECHAR CLICANDO FORA
========================================================= */

const modal =
    document.getElementById(
        "modal"
    );

if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                fecharModal();
            }
        }
    );
}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            fecharModal();

            notificationsPanel?.classList.remove(
                "active"
            );

            profileMenu?.classList.remove(
                "active"
            );
        }
    }
);


/* =========================================================
   LOGIN + MFA
========================================================= */

let codigoGerado = null;

let intervaloCodigo = null;


function gerarCodigo() {

    codigoGerado =
        Math.floor(
            100000 +
            Math.random() *
            900000
        ).toString();


    const campo =
        document.getElementById(
            "codigoAtual"
        );


    if (campo) {

        campo.innerText =
            "Código atual: " +
            codigoGerado;
    }


    console.log(
        "TOKEN MFA:",
        codigoGerado
    );
}


function iniciarMFA() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const codigoArea =
        document.getElementById(
            "codigoArea"
        );


    if (loginForm) {

        loginForm.style.display =
            "none";
    }


    if (codigoArea) {

        codigoArea.style.display =
            "block";
    }


    gerarCodigo();


    if (intervaloCodigo) {

        clearInterval(
            intervaloCodigo
        );
    }


    intervaloCodigo =
        setInterval(
            gerarCodigo,
            30000
        );
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const usuario =
                        document.getElementById(
                            "loginUser"
                        ).value.trim();


                    const senha =
                        document.getElementById(
                            "loginPass"
                        ).value.trim();


                    const mensagem =
                        document.getElementById(
                            "mensagem"
                        );


                    if (
                        usuario ===
                            usuarioPadrao.usuario &&
                        senha ===
                            usuarioPadrao.senha
                    ) {

                        if (mensagem) {

                            mensagem.style.color =
                                "green";

                            mensagem.innerText =
                                "Login correto. Informe o código MFA.";
                        }


                        iniciarMFA();

                    } else {

                        if (mensagem) {

                            mensagem.style.color =
                                "red";

                            mensagem.innerText =
                                "Usuário ou senha incorretos.";
                        }
                    }
                }
            );
        }


        const codigoForm =
            document.getElementById(
                "codigoForm"
            );


        if (codigoForm) {

            codigoForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const campoCodigo =
                        document.getElementById(
                            "codigo"
                        );


                    const mensagemCodigo =
                        document.getElementById(
                            "mensagemCodigo"
                        );


                    if (!campoCodigo) {

                        return;
                    }


                    const codigoDigitado =
                        campoCodigo.value.trim();


                    if (
                        codigoDigitado ===
                        codigoGerado
                    ) {

                        clearInterval(
                            intervaloCodigo
                        );

                        intervaloCodigo = null;


                        localStorage.setItem(
                            "usuarioLogado",
                            JSON.stringify(
                                usuarioPadrao
                            )
                        );


                        document.body.classList.add(
                            "logged"
                        );


                        if (mensagemCodigo) {

                            mensagemCodigo.style.color =
                                "green";

                            mensagemCodigo.innerText =
                                "Autenticação concluída. Acesso liberado.";
                        }


                        /*
                           ESCONDE A TELA DE LOGIN
                        */

                        const loginScreen =
                            document.getElementById(
                                "loginScreen"
                            );


                        if (loginScreen) {

                            loginScreen.style.display =
                                "none";
                        }


                        atualizarUsuarioNaInterface();

                        renderTodos();

                        atualizarDashboard();

                        atualizarNotificacoes();


                    } else {

                        if (mensagemCodigo) {

                            mensagemCodigo.style.color =
                                "red";

                            mensagemCodigo.innerText =
                                "Código inválido ou expirado.";
                        }
                    }
                }
            );
        }
    }
);


/* =========================================================
   USUÁRIO NA INTERFACE
========================================================= */

function atualizarUsuarioNaInterface() {

    const elementos = [

        document.getElementById(
            "usuarioNome"
        ),

        document.getElementById(
            "sidebarUsuarioNome"
        ),

        document.getElementById(
            "profileMenuNome"
        )

    ];


    elementos.forEach(
        elemento => {

            if (elemento) {

                elemento.innerText =
                    usuarioPadrao.nome;
            }
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "usuarioLogado"
    );

    document.body.classList.remove(
        "logged"
    );


    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const codigoArea =
        document.getElementById(
            "codigoArea"
        );


    if (loginScreen) {

        loginScreen.style.display =
            "flex";
    }


    if (loginForm) {

        loginForm.style.display =
            "block";
    }


    if (codigoArea) {

        codigoArea.style.display =
            "none";
    }


    if (intervaloCodigo) {

        clearInterval(
            intervaloCodigo
        );
    }


    const loginUser =
        document.getElementById(
            "loginUser"
        );

    const loginPass =
        document.getElementById(
            "loginPass"
        );

    const codigo =
        document.getElementById(
            "codigo"
        );


    if (loginUser) {
        loginUser.value = "";
    }

    if (loginPass) {
        loginPass.value = "";
    }

    if (codigo) {
        codigo.value = "";
    }


    document.getElementById(
        "mensagem"
    ).innerText = "";

    document.getElementById(
        "mensagemCodigo"
    ).innerText = "";


    profileMenu?.classList.remove(
        "active"
    );

    notificationsPanel?.classList.remove(
        "active"
    );
}

window.logout =
    logout;


/* =========================================================
   RENDERIZAÇÃO GERAL
========================================================= */

function renderTodos() {

    renderPacientes();

    renderMedicos();

    renderConsultas();

    renderProntuarios();

    renderInternacoes();

    renderMedicamentos();

    renderExames();
}


/* =========================================================
   LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (
            localStorage.getItem(
                "usuarioLogado"
            )
        ) {

            document.body.classList.add(
                "logged"
            );

            atualizarUsuarioNaInterface();

        } else {

            document.body.classList.remove(
                "logged"
            );
        }


        renderTodos();

        atualizarDashboard();

        atualizarNotificacoes();

        atualizarIconeTema();


        /*
           Mantém o dashboard
           como página inicial.
        */

        document
            .querySelectorAll(
                ".menu"
            )
            .forEach(
                menu => {

                    if (
                        menu.dataset.page ===
                        "dashboard"
                    ) {

                        menu.classList.add(
                            "active"
                        );
                    }
                }
            );
    }
);


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA
========================================================= */

setInterval(
    () => {

        atualizarDashboard();

    },
    5000
);