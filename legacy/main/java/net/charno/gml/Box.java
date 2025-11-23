package net.charno.gml;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class Box {
    /**
     * A min value for the bounding box
     */
    private GeometryPoints min;
    /**
     * A max value for the bounding box
     */
    private GeometryPoints max;

    /**
     * A constructor which prepopulates the min and max objects with values
     * 
     * @param minX Minimum X value for the bounding box
     * @param minY Minimum Y value for the bounding box
     * @param maxX Maximum X value for the bounding box
     * @param maxY Maximum Y value for the bounding box
     */
    public Box(double minX, double minY, double maxX, double maxY) {
        this.min = new GeometryPoints(minX, minY);
        this.max = new GeometryPoints(maxY, maxY);
    }

    /**
     * A constructor which prepopulates GeometryPoints objects
     * 
     * @param min The minimum GeometryPoints object
     * @param max The maximum GeometryPoints object
     */
    public Box(GeometryPoints min, GeometryPoints max) {
        this.min = min;
        this.max = max;
    }

    /**
     * A constructor which presets the minimum and maximum values to the 
     * smallest double value possible.
     */
    public Box() {
        this(4.9E-324D, 4.9E-324D, 4.9E-324D, 4.9E-324D);
    }

    public GeometryPoints getMin() {
        return this.min;
    }

    public void setMin(GeometryPoints min) {
        this.min = min;
    }

    public GeometryPoints getMax() {
        return this.max;
    }

    public void setMax(GeometryPoints max) {
        this.max = max;
    }
}
