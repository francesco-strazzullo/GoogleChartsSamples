function createAverageRoleRow(employers, roles, gender) {
    //come prima cosa prendo gli impiegati del sesso scelto
    var employersOfGender = _.where(employers, {gender: gender});

    var row = [];

    /*
     * Per ogni ruolo mi calcolo la media dei redditi
     */
    _.each(roles, function(role) {
        var employersOfRole = _.where(employersOfGender, {role: role});

        var sum = _.reduce(employersOfRole, function(memo, element) {
            return memo + element.annualIncome;
        }, 0);

        var averageOfRole = sum ? sum / employersOfRole.length : 0;

        row.push(averageOfRole);
    });

    //Calcolo poi la media annuale
    var totalAverage = _.reduce(row, function(memo, income) {
        return memo + income;
    }, 0) / row.length;

    row.push(totalAverage);

    //la prima colonna deve essere il sesso
    row.unshift(gender);

    return row;
}

function enumerateRoles(employers) {
    var roles = [];

    _.each(employers, function(employer) {
        if (!_.contains(roles, employer.role)) {
            roles.push(employer.role);
        }
    });

    return roles;
}

function createComboChart(employers, container) {
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Gender');

    var roles = enumerateRoles(employers);

    //Create Header
    _.each(roles, function(roleName) {
        data.addColumn('number', roleName);
    });

    data.addColumn('number', "Average");

    data.addRow(createAverageRoleRow(employers, roles, "male"));
    data.addRow(createAverageRoleRow(employers, roles, "female"));

    console.log(data.toJSON());

    var chart = new google.visualization.ComboChart(container);

    var options = {
        vAxis: {title: "Income", format: '\u20AC #,###'},
        hAxis: {title: "Gender"},
        height: 500,
        seriesType: "bars",
        colors: ['red', 'blue', 'pink', 'orange', 'green', 'yellow', 'black'],
        series: {6: {type: "line"}}
    };


    chart.draw(data, options);

}


function createOrgChart(employers, container) {
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Id');
    data.addColumn('string', 'Boss');

    data.addRows(_.map(employers, function(employer) {
        return [
            {v: employer.id.toString(), f: employer.name},
            typeof (employer.boss) === "number" ? employer.boss.toString() : ''];
    }));

    var chart = new google.visualization.OrgChart(container);

    chart.draw(data);

}

function createPieChart(emplyoers, container) {

    var genderData = new google.visualization.DataTable();

    //Creo intestazione DataTable
    genderData.addColumn('string', 'Gender');
    genderData.addColumn('number', 'Number');

    var maleEmplyoers = 0;
    var femaleEmplyoers = 0;

    /*
     * Scorro la lista di employers,
     * ed incremento i due contatori
     */
    _.each(emplyoers, function(emplyoer) {
        if ("male" === emplyoer.gender) {
            maleEmplyoers++;
        } else {
            femaleEmplyoers++;
        }
    });

    //Aggiungo le righe alla mia datatable
    genderData.addRow(['male', maleEmplyoers]);
    genderData.addRow(['female', femaleEmplyoers]);

    var chart = new google.visualization.PieChart(container);

    /*
     * L'oggetto options mi serve per impostare vari settaggi del
     * grafico, in questo caso i colori delle slices.
     */
    var options = {
        colors: ['blue', 'pink']
    };

    //Disegno infine l grafico
    chart.draw(genderData, options);

}

function formatCurrency(dataTable, columnIndex) {
    /*
     * Uso un formatter per formattare il valore che mi fa da tooltip nel formato
     * '€ 20.000,00'. NB: \u20AC è il valore Unicode del simbolo '€'
     */
    var formatter = new google.visualization.NumberFormat({
        decimalSymbol: ',',
        groupingSymbol: '.',
        prefix: '\u20AC '
    });

    formatter.format(dataTable, columnIndex);
}

function findBoss(employers, employer) {
    var boss = _.find(employers, function(innerElement) {
        return employer.boss === innerElement.id;
    });
    return boss ? boss.name : undefined;
}

function createTable(employers, container) {

    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Name');
    data.addColumn('string', 'Role');
    data.addColumn('string', 'Gender');
    data.addColumn('number', 'Age');
    data.addColumn('number', 'Annual income');
    data.addColumn('string', 'Boss');

    data.addRows(_.map(employers, function(element) {
        return [element.name,
            element.role,
            element.gender,
            element.age,
            element.annualIncome,
            findBoss(employers, element)];
    }));

    formatCurrency(data, 4);

    var chart = new google.visualization.Table(container);

    chart.draw(data, {showRowNumber: true});

}