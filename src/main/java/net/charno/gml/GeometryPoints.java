package net.charno.gml;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class GeometryPoints {

    /**
     * A value for the x geometry
     */
    private double x;
    /**
     * A value for the y geometry
     */
    private double y;

    /**
     * A constructor that accepts x and y values and sets the class variables.
     * 
     * @param x
     * @param y 
     */
    public GeometryPoints(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX() {
        return this.x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return this.y;
    }

    public void setY(double y) {
        this.y = y;
    }
}
