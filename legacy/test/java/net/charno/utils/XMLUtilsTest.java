package net.charno.utils;

import com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl;
import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import java.io.StringReader;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * Created by charno on 8/28/16.
 */
public class XMLUtilsTest {

    private static final String xml = "<sample><parent><child1 key=\"attribute\"></child1><child2><grandchild>value</grandchild></child2></parent></sample>";
    private Document doc;

    @Before
    public void setup() throws Exception {
        DocumentBuilderFactory factory = new DocumentBuilderFactoryImpl();
        DocumentBuilder builder = factory.newDocumentBuilder();
        doc = builder.parse(new InputSource(new StringReader(xml)));
        doc.getDocumentElement().normalize();
    }

    @Test
    public void testGetSingleValue() throws Exception {
        NodeList nodeList = doc.getElementsByTagName("child2");
        assertEquals("value", XMLUtils.getSingleValue((Element) nodeList.item(0), "grandchild"));
    }

    @Test
    public void testGetAttributes() throws Exception {
        NodeList nodeList = doc.getElementsByTagName("child1");
        Map<String, String> attributeMap = XMLUtils.getAttributes((Element) nodeList.item(0));
        assertNotNull(attributeMap);
        assertEquals("attribute", attributeMap.get("key"));
    }
}