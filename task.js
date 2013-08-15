function writeError(message){
  document.write("Error: " + message + "<br>");
}

function matchPosition (obj1, obj2){
  return (obj1.position[0] == obj2.position[0] && obj1.position[1] == obj2.position[1]);
}
/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 */
function Vessel(name, position, capacity) {
  this.name = name;
  this.position = position;
  this.capacity = capacity;
  this.ocupied = 0;
}

/**
 * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
 * @example
 * vesserl.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
 * @name Vessel.report
 */
Vessel.prototype.report = function () {
  var text = 'Корабль "' + this.name + '". Местоположение: ' + this.position + ".";
  if (this.getOccupiedSpace() == 0) {
    text += " Товаров нет."
  } else {
    text += " Занято: " + this.getOccupiedSpace() + " из " + this.capacity + "т.";
  }
  document.write(text + "<br>");
}

/**
 * Выводит количество свободного места на корабле.
 * @name Vessel.getFreeSpace
 */
Vessel.prototype.getFreeSpace = function () {
  return (this.capacity - this.ocupied);
}

/**
 * Выводит количество занятого места на корабле.
 * @name Vessel.getOccupiedSpace
 */
Vessel.prototype.getOccupiedSpace = function () {
  return this.ocupied;
}

Vessel.prototype.loadCargoTo = function (cargoWeight) {
  if (cargoWeight <= this.getFreeSpace()) {
    this.ocupied += cargoWeight;
  } else {
    writeError("Недостаточно места на корабле!");
  }
  return this;
}
/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.report
 */
Vessel.prototype.flyTo = function (newPosition) {
  if (newPosition instanceof Planet) {
    this.position = newPosition.position;
  } else {
    if ((typeof newPosition[0] == "number") && (typeof newPosition[1] == "number") && (newPosition.length == 2)) {
      this.position = newPosition;
    } else {
      writeError("Неверные координаты!");
    }
  }
  return this;
}

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 */
function Planet(name, position, availableAmountOfCargo) {
  this.name = name;
  this.position = position;
  this.availableAmountOfCargo = availableAmountOfCargo;
}

/**
 * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
 * @name Planet.report
 */
Planet.prototype.report = function () {
  var text = 'Планета "' + this.name + '". Местоположение: ' + this.position + ".";
    if (this.getAvailableAmountOfCargo() == 0) {
      text += " Грузов нет.";
    } else {
      text += ' Доступно груза: ' + this.getAvailableAmountOfCargo() + 'т.';
    }
  document.write(text + "<br>");
}

/**
 * Возвращает доступное количество груза планеты.
 * @name Vessel.getAvailableAmountOfCargo
 */
Planet.prototype.getAvailableAmountOfCargo = function () {
  return this.availableAmountOfCargo;
}

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 */
Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {
  if (matchPosition(vessel, this)) {
    if (vessel.getFreeSpace() >= cargoWeight) {
      if (this.getAvailableAmountOfCargo() >= cargoWeight) {
        vessel.loadCargoTo(cargoWeight);
        this.availableAmountOfCargo -= cargoWeight;
      } else {
        writeError("На планете недостаточно груза!" );
      }
    } else {
      writeError("На корабле недостаточно места!" );
    }
  } else {
    writeError("Корабль должен приземлиться на планету!" );
  }
}

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 */
Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {
  if (matchPosition(vessel, this)) {
    if (vessel.getOccupiedSpace() >= cargoWeight) {
      vessel.loadCargoTo(- cargoWeight);
      this.availableAmountOfCargo += cargoWeight;
    } else {
      writeError("Недостаточно груза на корабле!")
    }
  } else {
    writeError("Корабль должен приземлиться на планету!");
  }
}
var vessel = new Vessel('Яндекс', [0,0], 1000);
var planetA = new Planet('A', [0,0], 0);
var planetB = new Planet('B', [100, 100], 5000);

// Проверка текущего состояния
vessel.report(); // Корабль "Яндекс". Местоположение: 0,0. Занято: 0 из 1000т.
planetA.report(); // Планета "A". Местоположене: 0,0. Грузов нет.
planetB.report(); // Планета "B". Местоположене: 100,100. Доступно груза: 5000т.

vessel.flyTo(planetB);

planetB.loadCargoTo(vessel, 1000);
vessel.report(); // Корабль "Яндекс". Местоположение: 100,100. Занято: 1000 из 1000т.

vessel.flyTo(planetA);
planetA.unloadCargoFrom(vessel, 500);
vessel.report(); // Корабль "Яндекс". Местоположение: 0,0. Занято: 500 из 1000т.
planetA.report(); // Планета "A". Местоположение: 0,0. Доступно груза: 500т.
planetB.report(); // Планета "B". Местоположение: 100,100. Доступно груза: 4000т.
