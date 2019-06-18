export class GeometryObject {
  object;
  coordinate;
  constructor(object, coordinate) {
    this.object = object;
    this.coordinate = coordinate;
  }

  get getObject() {
    return this.object;
  }

  get getCoordinate() {
    return this.coordinate;
  }
}
