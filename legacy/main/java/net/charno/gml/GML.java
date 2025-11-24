package net.charno.gml;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class GML {

    /**
     * The bounding box object.
     */
    private Box gmlBox;
    /**
     * The GML attributes.
     */
    private List<Attributes> gmlAttributes;

    /**
     * The default constructor which instantiates a new Box and gmlAttributes
     * List.
     */
    public GML() {
        this.gmlBox = new Box();
        this.gmlAttributes = new ArrayList();
    }

    public Box getGmlBox() {
        return this.gmlBox;
    }

    public void setGmlBox(Box gmlBox) {
        this.gmlBox = gmlBox;
    }

    public List<Attributes> getGmlAttributes() {
        return this.gmlAttributes;
    }

    public void setGmlAttributes(List<Attributes> gmlAttributes) {
        this.gmlAttributes = gmlAttributes;
    }
}
