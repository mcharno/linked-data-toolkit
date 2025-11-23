package net.charno.gml;

import java.util.ArrayList;
import java.util.List;
import net.charno.gml.enums.GeometryType;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class Geometry {

    /**
     * A GML GeometryType object
     */
    private GeometryType geometryType;
    /**
     * A list of GML GeometryPoints
     */
    private List<GeometryPoints> geometryPoints;
    /**
     * A Well Known Text (WKT) object
     */
    private StringBuilder wktPoints;

    /**
     * A constructor that instantiates all of the class variables and begins 
     * populating the wktPoints object.
     * 
     * @param geometryType 
     */
    public Geometry(GeometryType geometryType) {
        this.geometryType = geometryType;
        this.geometryPoints = new ArrayList();
        this.wktPoints = new StringBuilder();
        this.wktPoints.append("Polygon((");
    }

    public GeometryType getGeometryType() {
        return this.geometryType;
    }

    public void setGeometryType(GeometryType geometryType) {
        this.geometryType = geometryType;
    }

    public List<GeometryPoints> getGeometryPoints() {
        return this.geometryPoints;
    }

    public void setGeometryPoints(List<GeometryPoints> geometryPoints) {
        this.geometryPoints = geometryPoints;
    }

    public StringBuilder getWktPoints() {
        return this.wktPoints;
    }

    public void setWktPoints(StringBuilder wktPoints) {
        this.wktPoints = wktPoints;
    }
}
