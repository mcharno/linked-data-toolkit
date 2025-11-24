package net.charno.gml;

import net.charno.gml.enums.GeometryType;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public abstract class FeatureMember {

    /**
     * The Feature ID
     */
    private String fid;
    /**
     * The geometry object
     */
    private Geometry geometry;

    /**
     * A constructor that presets the Geometry object to a GeometryType of 
     * LINESTRING
     */
    public FeatureMember() {
        this.geometry = new Geometry(GeometryType.LINESTRING);
    }

    public String getFid() {
        return this.fid;
    }

    public void setFid(String fid) {
        this.fid = fid;
    }

    public Geometry getGeometry() {
        return this.geometry;
    }

    public void setGeometry(Geometry geometry) {
        this.geometry = geometry;
    }
}
